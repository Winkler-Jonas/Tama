import { useLanguageStore } from '@/stores/langStore.js';
import {getAIErrorMessage} from "@/utils/AIerrorHandler.js";

class WebSocketService {
    constructor() {
        this.routesWithLocale = ['/ws/askAI/', '/ws/focusUP/', '/ws/getDaily/']
        this.usernameSocket = null;
        this.emailSocket = null;
        this.usernameCallbacks = {};
        this.emailCallbacks = {};
        this.usernameQueue = [];
        this.emailQueue = [];
        this.sockets = {};
        this.handlers = {};
        this.onMessage = null
        this.onError = null
    }

    getWebSocketProtocol() {
        return window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    }

    getWebSocketUrl = (endpoint) => {
        const store = useLanguageStore();
        const locale = store.locale;
        const token = localStorage.getItem('accessToken');
        const suffix = this.routesWithLocale.includes(endpoint) ? `${locale}/?token=${token}` : ''
        return `${this.getWebSocketProtocol()}//${window.location.host}${endpoint}${suffix}`;
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

    async createSocket(key, urlPath) {
        const store = useLanguageStore();
        const currentLocale = store.locale;
        const existingSocket = this.sockets[key];

        if (existingSocket) {
            const url = new URL(existingSocket.url);
            const urlLocale = url.searchParams.get('locale');

            if (existingSocket.readyState < WebSocket.CLOSING && currentLocale === urlLocale) {
                switch (existingSocket.readyState) {
                    case WebSocket.OPEN:
                        return "open";
                    case WebSocket.CONNECTING:
                        return "connecting";
                }
            } else {
                this.closeSocket(key);
            }
        }

        return new Promise((resolve, reject) => {
            const socket = new WebSocket(this.getWebSocketUrl(urlPath));
            this.setupSocketHandlers(socket, key, resolve, reject);
        });
    }

    setupSocketHandlers(socket, key, resolve, reject) {
        socket.onopen = () => {
            resolve("open");
        };
        socket.onerror = (error) => {
            reject("error");
        };
        socket.onclose = () => {
            this.sockets[key] = null;
            reject("closed");
        };
        socket.onmessage = (event) => {
            const handler = this.handlers[key];
            if (handler && handler.onMessage) {
                const data = JSON.parse(event.data);
                if (data.error) {
                    if (handler.onError) {
                        handler.onError(getAIErrorMessage(data.error).message);
                    }
                } else {
                    handler.onMessage(data.message);
                }
            }
        };
        this.sockets[key] = socket;
    }


    send(key, message) {
        const store = useLanguageStore(); // Fetch the store here to get the latest locale
        const socket = this.sockets[key];
        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                const locale = store.locale;
                const messageWithLocale = {...message, locale};
                socket.send(JSON.stringify(messageWithLocale));
            } else {
                // todo: no connection
            }
        } else {
            // todo: no connection
        }
    }


    closeSocket(key) {
        const socket = this.sockets[key];
        if (socket) {
            socket.close();
            this.sockets[key] = null;
        }
    }

    setHandler(key, handler) {
        this.handlers[key] = handler;
    }
}

export default new WebSocketService();
