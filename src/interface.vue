<template>
  <p>{{ listening ? t("Synced") : error ? t("Error") : t("Starting...") }}</p>
  <v-dialog v-if="showWarning" v-model="confirmRefresh" @esc="stay()">
    <v-card>
      <v-card-title>{{ t("Unsaved Changes") }}</v-card-title>
      <v-card-text>{{
        t(
          "This item was updated. Do you want to refresh? If you have changes, they will be lost."
        )
      }}</v-card-text>
      <v-card-actions>
        <v-button secondary @click="stay()">
          {{ t("Stay") }}
        </v-button>
        <v-button @click="refresh()">{{ t("Refresh") }}</v-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { type Field } from "@directus/types";
import { useSdk, useStores } from "@directus/extensions-sdk";
import { realtime, readItem } from "@directus/sdk";
import { onMounted, onUnmounted, ref, computed, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  value: string;
  collection: string;
  primaryKey: any;
  showWarning: boolean;
}>();

const emit = defineEmits(["input"]);

const { useFieldsStore } = useStores();
const fieldsStore = useFieldsStore();
const sdk = useSdk();
const router = useRouter();
const { t } = useI18n();

const { showWarning, primaryKey } = toRefs(props);
const listening = ref(false);
const error = ref("");
const confirmRefresh = ref(false);
const initialItem = ref({});

const primaryKeyField = computed<Field>(() => {
  return fieldsStore.getPrimaryKeyFieldForCollection(props.collection);
});

const rootPath = window.location.pathname.replace(/\/admin.*/, "/");
const reconnectionParams = { delay: 1000, retries: 10 };

const client = sdk.with(
  realtime({
    authMode: "strict",
    url: `${sdk.url.protocol === "https:" ? "wss" : "ws"}://${sdk.url.host}${rootPath}websocket`,
    reconnect: reconnectionParams,
  })
);

onMounted(async () => {
  connect();
});

onUnmounted(() => {
  disconnect();
});

watch(primaryKey, async (newValue, oldValue) => {
  if (newValue && newValue !== "+") {
    initialItem.value = await sdk.request(
      readItem(props.collection, primaryKey.value)
    );

    listening.value = true;
  }
});

function connect() {
  client.onWebSocket("open", async function () {
    const { subscription } = await client.subscribe(props.collection, {
      event: "update",
    });

    for await (const message of subscription) {
      if (message.event === "update") {
        const thisOne = message.data.find(
          (item) =>
            String(item[primaryKeyField.value.field]) ===
            String(primaryKey.value)
        );

        if (thisOne) {
          showConfirmRefresh(thisOne);
        }
      }
    }
  });

  client.onWebSocket("close", function () {
    listening.value = false;
  });

  client.onWebSocket("error", function (e) {
    error.value = e.type;
    listening.value = false;
  });

  client.connect();
}

function disconnect() {
  client.disconnect();
}

function showConfirmRefresh(payload: Record<string, any>) {
  // Prevent primary to be refreshed. Only secondaries
  const changed = Object.keys(initialItem.value).some(
    (key) => String(initialItem.value[key]) !== String(payload[key])
  );

  if (changed) {
    if (showWarning.value === true) {
      confirmRefresh.value = true;
    } else {
      refresh();
    }
  }
}

function stay() {
  confirmRefresh.value = false;
}

function refresh() {
  confirmRefresh.value = true;
  router.go(0);
}
</script>
