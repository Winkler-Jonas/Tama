class WebSocketService {
    constructor() {
        this.usernameSocket = null;
        this.emailSocket = null;
        this.username = null;
        this.email = null;
        this.setUsernameError = null;
        this.setEmailError = null;
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
        if (!this.usernameSocket) {
            this.usernameSocket = new WebSocket(this.getWebSocketUrl('/ws/check_username/'));
            this.usernameSocket.onmessage = this.handleUsernameMessage.bind(this);
            this.usernameSocket.onopen = () => {
                this.usernameQueue.forEach((msg) => this.usernameSocket.send(msg));
                this.usernameQueue = [];
            };
        }
    }

    connectEmailSocket() {
        if (!this.emailSocket) {
            this.emailSocket = new WebSocket(this.getWebSocketUrl('/ws/check_email/'));
            this.emailSocket.onmessage = this.handleEmailMessage.bind(this);
            this.emailSocket.onopen = () => {
                this.emailQueue.forEach((msg) => this.emailSocket.send(msg));
                this.emailQueue = [];
            };
        }
    }

    handleUsernameMessage(event) {
        const data = JSON.parse(event.data);
        if (data.username === this.username) {
            this.setUsernameError(data.is_available ? '' : 'Username is already taken');
        }
    }

    handleEmailMessage(event) {
        const data = JSON.parse(event.data);
        if (data.email === this.email) {
            this.setEmailError(data.is_available ? '' : 'Email is already taken');
        }
    }

    checkUsername(username, setUsernameError) {
        this.username = username;
        this.setUsernameError = setUsernameError;
        this.connectUsernameSocket();
        const message = JSON.stringify({ username: this.username });
        if (this.usernameSocket.readyState === WebSocket.OPEN) {
            this.usernameSocket.send(message);
        } else {
            this.usernameQueue.push(message);
        }
    }

    checkEmail(email, setEmailError) {
        this.email = email;
        this.setEmailError = setEmailError;
        this.connectEmailSocket();
        const message = JSON.stringify({ email: this.email });
        if (this.emailSocket.readyState === WebSocket.OPEN) {
            this.emailSocket.send(message);
        } else {
            this.emailQueue.push(message);
        }
    }
}

export default new WebSocketService();
