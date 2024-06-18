import { useLanguageStore } from '@/stores/langStore.js';
import {getAIErrorMessage} from "@/utils/AIerrorHandler.js";

class WebSocketService {
    constructor() {
        this.routesWithLocale = ['/ws/askAI/', '/ws/focusUP/']
        this.usernameSocket = null;
        this.emailSocket = null;
        this.usernameCallbacks = {};
        this.emailCallbacks = {};
        this.usernameQueue = [];
        this.emailQueue = [];
        this.AISocket = null;
        this.onMessage = null
        this.onError = null
    }

    getWebSocketProtocol() {
        return window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    }

    getWebSocketUrl = (endpoint) => {
        const store = useLanguageStore()
        const locale = store.locale
        const token = localStorage.getItem('token');
        const suffix = this.routesWithLocale.includes(endpoint) ? `${locale}/?token=${token}` : ''

        return `${this.getWebSocketProtocol()}//${window.location.host}${endpoint}${suffix}`
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

    async createSocket(urlPath) {
        if (this.AISocket) {
            if (this.AISocket.readyState === WebSocket.OPEN) {
                return Promise.resolve("open");
            } else if (this.AISocket.readyState === WebSocket.CONNECTING) {
                return Promise.resolve("connecting");
            }
        }

        return new Promise((resolve, reject) => {
            this.AISocket = new WebSocket(this.getWebSocketUrl(urlPath));
            this.AISocket.onopen = () => {
                resolve("open");
            };
            this.AISocket.onerror = (error) => {
                reject("error");
            };
            this.AISocket.onmessage = (event) => {
                if (this.onMessage) {
                    const data = JSON.parse(event.data);
                    if (data.error) {
                        if (this.onError) {
                            this.onError(getAIErrorMessage(data.error).message);
                        }
                    } else {
                        this.onMessage(Object.values(data.message));
                    }
                }
            };
            this.AISocket.onclose = () => {
                this.AISocket = null;
                reject("closed");
            };
        });
    }

    async send(message) {
        if (this.AISocket && this.AISocket.readyState === WebSocket.OPEN) {
            this.AISocket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    }

    closeSocket() {
        if (this.AISocket) {
            this.AISocket.close();
            this.AISocket = null;
        }
    }

    setOnMessageHandler(handler) {
        this.onMessage = handler;
    }

    setOnErrorHandler(handler) {
        this.onError = handler;
    }
}

export default new WebSocketService();
