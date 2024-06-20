import api from './api';

class FeedbackService {
    getAllFeedback() {
        return api.get('/feedback/');
    }

    getFeedbackById(id) {
        return api.get(`/feedback/${id}/`);
    }

    createFeedback(data) {
        return api.post('/feedback/', data);
    }

    deleteFeedback(id) {
        return api.delete(`/feedback/${id}/`);
    }
}

export default new FeedbackService();
