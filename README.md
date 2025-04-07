# directus-extension-refresh-on-changed

This Directus custom interface allows current item to be refreshed whenever the item is changed elsewhere.

## Install

Install directly from Marketplace or alternatively do:

```sh
$ npm run build
$ cp package.json dist directus/extensions/directus-extension-refresh-on-changed
```


## Enable the extension
After installing the extension you can add it to any collection inside your directus project.
Note that by default the extension is not added anywhere automatically.
It's up to you to decide which collections should be watched.

### Steps to activate inside a target collection
- create a new field
- look for the new "Refresh item on item update" interface (search or scroll down)
- choose a name for your field, e.g. "refresh" or "alert_if_changed"
- optionally, enable the warning
- choose which fields to watch inside the target collection

![Screenshot of the Directus interface configuration panel showing four main settings: 1. Select new field type (with a refresh icon), 2. Choose a name field (set to 'refresh'), 3. Toggle warning option enabled, and 4. Choose fields to watch section displaying 'Title', 'Status', and 'Blocks' fields with remove options. A Save button appears at the bottom of the panel.](/docs/options.png)

### Options

- Show warning: When enabled, it will display a warning to clients currently viewing the item, whenever the item is changed.

### Interface inside the target collection
- the new field you created will be visible inside the target collection like this:
![Screenshot of a Directus page editing interface showing a Home page configuration. At the top, there are two fields labeled with green arrows: 'Refresh' (labeled as 'The name you picked for the field') and 'Synced' (labeled as 'Current status'). Below these are input fields for Title (set to 'Home') and 'Permalink', followed by 'Status' and 'Published At'.](/docs/in-target-collection.png)

### Example warning
- if enable the warning, this is how you will be notified if another user edited (and saved) the same item you are currently viewing:
![Screenshot of a modal dialog showing an unsaved changes warning. The dialog is titled 'Unsaved Changes' and displays the message 'This item was updated. Do you want to refresh? If you have changes, they will be lost.' At the bottom are two buttons: a light gray 'Stay' button and a pink 'Refresh' button. Above the dialog is a green text label explaining 'Alert that is shown if another user edited the item that you currently view.' The dialog appears over a darkened interface background.](/docs/example-alert.png)

Keywords:
directus, interface, extension, websocket, realtime, refresh, change, update

