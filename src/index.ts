import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "refresh-on-update",
  name: "Refresh item on item update",
  icon: "refresh",
  description: "Refreshes the item when item is updated",
  component: InterfaceComponent,
  options: [
    {
      field: "showWarning",
      name: "$t:Show warning",
      type: "boolean",
      meta: {
        interface: "boolean",
        width: "half",
      },
      schema: {
        default_value: false,
      },
    },
  ],
  types: ["alias"],
  localTypes: ["presentation"],
});
