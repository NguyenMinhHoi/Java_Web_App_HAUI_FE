import {useDispatch, useSelector} from 'react-redux';
import urlManager from './urlManager';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL,getMetadata } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

class AxiosSupport {

    constructor(baseURL = 'http://localhost:8080', token = null) {
        this.baseURL = baseURL;
        this.endpoints = urlManager;
        this.token = token;
        const firebaseConfig = {
            apiKey: "AIzaSyAewhdQuJuOebuT8PqvOvV_izJSMOvfSFQ",
            authDomain: "demofirebase-6e7a1.firebaseapp.com",
            projectId: "demofirebase-6e7a1",
            storageBucket: "demofirebase-6e7a1.appspot.com",
            messagingSenderId: "600682198593",
            appId: "1:600682198593:web:e88c7a4373648fabc3b8c0",
            measurementId: "G-DLSK3MYRFK"
        };
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app); // Get the Firebase Authentication instance
        this.storage = getStorage(app); // Get the Firebase Storage instance
    }

    getFullURL(endpointKey, id = null) {
        const endpoint = this.endpoints[endpointKey];
        if (typeof endpoint === 'function') {
            return `${this.baseURL}${endpoint(id)}`;
        }
        if (!endpoint) {
            throw new Error(`Endpoint ${endpointKey} không tồn tại`);
        }
        return `${this.baseURL}${endpoint}`;
    }

    async fetchWithAuth(endpointKey, options = {}, id = null) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        };

        const url = this.getFullURL(endpointKey, id);
        const queryParams = new URLSearchParams(options.params).toString();
        const response = await fetch(`${url}${queryParams ? `?${queryParams}` : ''}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text(); // Lấy thông tin lỗi từ phản hồi
            throw new Error(`Lỗi: ${response.status} - ${errorText}`); // In ra thông tin lỗi
        }

        if (response.status === 204) {
            return null; // Không có nội dung, không cần phân tích cú pháp
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Phân tích cú pháp phản hồi JSON
        }

        return null;
    }
    async createProduct (productData) {
        return this.fetchWithAuth('createProduct', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    async getProducts (merchantId) {
        return this.fetchWithAuth('createProduct', {
            method: 'GET'
        },merchantId);
    }

    // Thêm method này vào class AxiosSupport
    async createMerchant(merchantData) {
        return this.fetchWithAuth('createMerchant', {
            method: 'POST',
            body: JSON.stringify(merchantData),
        });
    }

    async getMerchantByUserId(id) {
        return this.fetchWithAuth('getMerchant', {
            method: 'GET',
        },id);
    }

    async getProductByMerchantId(id) {
        return this.fetchWithAuth('getProductByMerchantId', {
            method: 'GET',
        },id);
    }

    async getAllCategory() {
        return this.fetchWithAuth('getAllCategories', {
            method: 'GET',
        });
    }

    async getVariantByProductId(id) {
        return this.fetchWithAuth('getVariantByProductId', {
            method: 'GET',
        },id);
    }

    async saveVariants(id,groupVariants) {
        let arr =[]
        console.log(groupVariants);
        groupVariants.forEach(group => {
            group.options.forEach(option => {option.id = ""})
            arr.push({
                name: group.name,
                options: group.options
            })
        });
        console.log(arr);
        return this.fetchWithAuth('saveVariants', {
            method: 'POST',
            body: JSON.stringify(arr),
        },id);
    }
    async updateVariants(groupVariants,productId) {
        const updatedVariants = groupVariants.map(variant => ({
            ...variant,
            product: {
                id: productId
            }
        }));
        return this.fetchWithAuth('updateVariant', {
            method: 'PUT',
            body: JSON.stringify(updatedVariants),
        });
    }

    async getAllProduct(page,size) {
        return this.fetchWithAuth('getAllProducts', {
            method: 'GET',
            params: {
                page: page,
                size: size
            }
        });
    }

    async getDetailsProduct(id) {
        return this.fetchWithAuth('getDetailProduct', {
            method: 'GET'
        },id);
    }

    async updateCart(variantId,userId) {
        return this.fetchWithAuth('updateCart', {
            method: 'PUT',
            body: JSON.stringify({
                "variantId": variantId,
                "userId": userId
            })
        });
    }

    async getUserById(userId) {
        return this.fetchWithAuth('getUserById', {
            method: 'GET'
        },userId);
    }

    async getCartByUserId(userId) {
        return this.fetchWithAuth('getCartByUserId', {
            method: 'GET'
        },userId);
    }

    async updateVariantCart(userId, variantCurrent, variantNew) {
        return this.fetchWithAuth('updateVariantCard', {
            method: 'PUT'
        },{
            userId: userId,
            variantCurrent: variantCurrent,
            variantNew: variantNew
        });
    }

    async getReviewsByProductId(productId) {
        return this.fetchWithAuth('getReviewsByProductId', {
            method: 'GET'
        },productId);
    }

    async createReview(review) {
        return this.fetchWithAuth('createReview', {
            method: 'POST',
            body: JSON.stringify(review)
        });
    }

    async getUserDetail(id) {
        return this.fetchWithAuth('getUserDetail', {
            method: 'GET'
        },id);
    }

    async saveUserAddress(address,id) {
        const data = {
            detail: address.address,
            ward: address.ward,
            province: address.province,
            district: address.district,
            isDefault: true,
        }
        return this.fetchWithAuth('saveUserAddress', {
            method: 'POST',
            body: JSON.stringify(data)
        },id);
    }

    async createOrder(order) {
        return this.fetchWithAuth('createOrder', {
            method: 'POST',
            body: JSON.stringify(order)
        });
    }

}

export default AxiosSupport;
