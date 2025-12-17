const API_CONFIG = {
    // DEVELOPMENT_URL: 'http://10.0.2.2:3000/api', // Android Emulator localhost
    // BASE_URL: 'https://testing-backend-akshaya.vercel.app/api', // NGTOK URL
    BASE_URL: 'https://5ffe2cbc07d8.ngrok-free.app/api',
    TIMEOUT: 60000,
};

const createAbortController = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    return { controller, timeoutId };
};

const apiCall = async (endpoint, options = {}) => {
    const { controller, timeoutId } = createAbortController();

    try {
        console.log(`[API] ${options.method || 'GET'} ${API_CONFIG.BASE_URL}${endpoint}`);

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        console.log(`[API] Response:`, data.success ? 'Success' : 'Failed', data);

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('[API] Request timeout');
            throw new Error('Request timeout. Please check your connection.');
        }

        console.error('[API] Error:', error);
        throw error;
    }
};

export const riderAPI = {
    // Authentication
    login: (phone, password) =>
        apiCall('/rider/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password }),
        }),

    register: (riderData) =>
        apiCall('/rider/auth/register', {
            method: 'POST',
            body: JSON.stringify(riderData),
        }),

    // Orders
    getAssignedOrders: (riderId) =>
        apiCall(`/orders?riderId=${riderId}&status=inProgress`), // Fetch assigned (inProgress) orders

    // Also fetch ready orders that might be waiting for pickup
    getReadyOrders: (riderId) =>
        apiCall(`/orders?riderId=${riderId}&status=ready`),

    getOrderHistory: (riderId) =>
        apiCall(`/orders?riderId=${riderId}&status=delivered`),

    updateOrderStatus: (orderId, status) =>
        apiCall(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    // Profile
    getProfile: (riderId) =>
        apiCall(`/riders/${riderId}`),

    updateProfile: (riderId, profileData) =>
        apiCall(`/riders/${riderId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }),

    updateStatus: (riderId, status) =>
        apiCall(`/riders/${riderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    updateFCMToken: (riderId, fcmToken) =>
        apiCall('/rider/auth/fcm', {
            method: 'POST',
            body: JSON.stringify({ riderId, fcmToken }),
        }),
};

export default riderAPI;
