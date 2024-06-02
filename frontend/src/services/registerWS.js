class WebSocketService {
    constructor() {
        this.usernameSocket = null;
        this.emailSocket = null;
        this.usernameCallbacks = {};
        this.emailCallbacks = {};
        this.usernameQueue = [];
        this.emailQueue = [];
    }

    getWebSocketProtocol() {
        return window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    }

    getWebSocketUrl(endpoint) {
        return `${this.getWebSocketProtocol()}//${window.location.host}${endpoint}`;
    }

    connectUsernameSocket() {
        if (!this.usernameSocket || this.usernameSocket.readyState === WebSocket.CLOSED) {
            this.usernameSocket = new WebSocket(this.getWebSocketUrl('/ws/check_username/'));
            this.usernameSocket.onmessage = this.handleUsernameMessage.bind(this);
            this.usernameSocket.onopen = () => {
                this.usernameQueue.forEach((msg) => {
                    if (this.usernameSocket && this.usernameSocket.readyState === WebSocket.OPEN) {
                        this.usernameSocket.send(msg);
                    } else {
                        this.usernameQueue.push(msg);
                    }
                });
                this.usernameQueue = [];
            };
            this.usernameSocket.onclose = () => {
                this.usernameSocket = null;
            };
        }
    }

    connectEmailSocket() {
        if (!this.emailSocket || this.emailSocket.readyState === WebSocket.CLOSED) {
            this.emailSocket = new WebSocket(this.getWebSocketUrl('/ws/check_email/'));
            this.emailSocket.onmessage = this.handleEmailMessage.bind(this);
            this.emailSocket.onopen = () => {
                this.emailQueue.forEach((msg) => {
                    if (this.emailSocket && this.emailSocket.readyState === WebSocket.OPEN) {
                        this.emailSocket.send(msg);
                    } else {
                        this.emailQueue.push(msg);
                    }
                });
                this.emailQueue = [];
            };
            this.emailSocket.onclose = () => {
                this.emailSocket = null;
            };
        }
    }

    disconnectUsernameSocket() {
        if (this.usernameSocket) {
            this.usernameSocket.close();
            this.usernameSocket = null;
        }
    }

    disconnectEmailSocket() {
        if (this.emailSocket) {
            this.emailSocket.close();
            this.emailSocket = null;
        }
    }

    handleUsernameMessage(event) {
        const data = JSON.parse(event.data);
        const callback = this.usernameCallbacks[data.username];
        if (callback) {
            callback(data.is_available);
            delete this.usernameCallbacks[data.username];
        }
    }

    handleEmailMessage(event) {
        const data = JSON.parse(event.data);
        const callback = this.emailCallbacks[data.email];
        if (callback) {
            callback(data.is_available);
            delete this.emailCallbacks[data.email];
        }
    }

    checkUsername(username) {
        return new Promise((resolve) => {
            this.connectUsernameSocket();
            const message = JSON.stringify({ username });
            this.usernameCallbacks[username] = resolve;
            if (this.usernameSocket.readyState === WebSocket.OPEN) {
                this.usernameSocket.send(message);
            } else {
                this.usernameQueue.push(message);
            }
        });
    }

    checkEmail(email) {
        return new Promise((resolve) => {
            this.connectEmailSocket();
            const message = JSON.stringify({ email });
            this.emailCallbacks[email] = resolve;
            if (this.emailSocket.readyState === WebSocket.OPEN) {
                this.emailSocket.send(message);
            } else {
                this.emailQueue.push(message);
            }
        });
    }
}

export default new WebSocketService();
