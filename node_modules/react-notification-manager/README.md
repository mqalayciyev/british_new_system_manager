## Setup

Typical usage involves wrapping your entire app with a `<NotificationProvider>`:

```jsx
import * as React from "react";
import ReactDOM from "react-dom";
import { NotificationProvider } from "react-notification-manager";
import App from "./App";

ReactDOM.render(
    <NotificationProvider>
        <App />
    </NotificationProvider>,
    document.getElementById("root")
);
```

Now you can use `useNotificationManager` to create notifications.

```jsx
import * as React from "react";
import { useNotificationManager } from "react-notification-manager";

// Your own Dialog component
import Dialog from "./your-app/dialog";

function App() {
    const { createNotification } = useNotificationManager();

    return (
        <button
            onClick={createNotification(({ close }) => (
                <Dialog onClose={close} />
            ))}>
            Open Dialog
        </button>
    );
}
```
