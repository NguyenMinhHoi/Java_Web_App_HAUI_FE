import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {FaEnvelope, FaHeart, FaShoppingCart, FaStar, FaTimes, FaUpload} from 'react-icons/fa';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useAxiosSupport from '../hooks/useAxiosSupport';
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import default_image from '../assets/images/default-image.svg';
import VariantSelect from "./VariantSelect";
import {useSelector} from "react-redux";
import ClientHeader from "../pages/clientPage/ClientHeader";

const ProductDetail = () => {
    const {id} = useParams();
    const axiosSupport = useAxiosSupport();
    const {id: userId} = useSelector(state => state.user);
    const swiperRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [variants, setVariants] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [images, setImages] = useState([]);
    const [groupOptions, setGroupOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [commentImage, setCommentImage] = useState(null);
    const [rating, setRating] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);


    const navigate = useNavigate();
    const handleProductClick = (item) => {
        navigate(`/product/${item.id}`);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (selectedOptions.length === groupOptions.length) {
            setSelectedVariant(
                variants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]))
            )
        }
    }, [selectedOptions]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await axiosSupport.getDetailsProduct(id);
                setProduct(res.product);

                const productImages = res.product.image || [];
                let allImages = [...productImages]

                if (res.relatedProducts) {
                    setRelatedProducts(res.relatedProducts);
                }

                if (res.variants) {
                    setVariants(res.variants);
                    res.variants.forEach(variant => {
                        if (variant.image && !allImages.some(img => img.id === variant.image.id)) {
                            allImages.push(variant.image);
                        }
                    });
                }

                if (res.product.groupOptions) {
                    setGroupOptions(res.product.groupOptions);
                }

                setImages(allImages);

                setSelectedImage(0);

                const reviewsRes = await axiosSupport.getReviewsByProductId(id);
                setComments(reviewsRes || []);

            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();

    }, [id, axiosSupport]);


    useEffect(() => {
        if (images[selectedImage]) {
            const variantWithSelectedImage = variants.find(variant =>
                variant.image && variant.image.id === images[selectedImage].id
            );
            if (variantWithSelectedImage) {
                setSelectedVariant(variantWithSelectedImage);
            }
        }
    }, [selectedImage, images, variants])

    const handleAddToCart = async () => {
        if (variants.length > 1 && selectedVariant) {
            await axiosSupport.updateCart(selectedVariant.id, userId);
        } else {
            await axiosSupport.updateCart(variants[0].id, userId);
        }

        console.log("Added to cart:", product.name);
    };

    const handleAddToWishlist = () => {
        // Implement add to wishlist functionality
        console.log("Added to wishlist:", product.name);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setCommentImage(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const comment = {
              content: newComment,
              images: [{
                   path: commentImage
              }],
              product: {
                   id: product.id
              },
              user: {
                   id: userId
              },
              rating: rating,
              createdAt: new Date()
        }

        await axiosSupport.createReview(comment);

        // Reset form sau khi gửi
        setNewComment('');
        setRating(0);
        setCommentImage(null);
    };



    if (!product) return <div>Loading...</div>;

    const handleOptionSelect = (groupName, optionName) => {
        const prevOptions = {...selectedOptions, [groupName]: optionName};
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [groupName]: optionName
        }));
        console.log(prevOptions);

        const matchingVariant = variants.find(variant =>
            variant.options.every(opt =>
                prevOptions[opt.groupName] === opt.name
            )
        );


        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            if (matchingVariant.image) {
                const imageIndex = images.findIndex(img => img.id === matchingVariant.image.id);
                if (imageIndex !== -1) {
                    setSelectedImage(imageIndex);
                    swiperRef.current.slideTo(imageIndex);
                }
            }
        }
    };

    const removeImage = () => {
        setCommentImage(null);
    };

    const animateAddToCart = async () => {
        setIsAnimating(true);
        setIsAddingToCart('loading')
        try {
            await handleAddToCart(); // Assuming this is your function to add the item to the cart
            setTimeout(()=>{
                setIsAddingToCart('success');
            },1000)
            setTimeout(() => {
                setIsAnimating(false);
                setIsAddingToCart('loading'); // Reset for next time
            }, 2000);
        } catch (error) {
            setIsAnimating(false);
            setIsAddingToCart('error');
            // Wait for 2 seconds before closing the modal
            setTimeout(() => {
                setIsAnimating(false);
                setIsAddingToCart('loading'); // Reset for next time
            }, 2000);
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {userId ? <ClientHeader currentUser={userId}/> : <HomeHeader/>}

            <main className="flex-grow mt-5">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={1}
                                navigation
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                pagination={{clickable: true}}
                                onSlideChange={(swiper) => {
                                    const newIndex = swiper.activeIndex;
                                    setSelectedImage(newIndex);

                                    // Find the variant that matches the selected image
                                    const selectedImg = images[newIndex];
                                    if (selectedImg) {
                                        const matchingVariant = variants.find(variant =>
                                            variant.image && variant.image.id === selectedImg.id
                                        );
                                        if (matchingVariant) {
                                            setSelectedVariant(matchingVariant);
                                        } else {
                                            setSelectedVariant(null);
                                        }
                                    }
                                }}
                            >
                                {images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div
                                            className="w-full h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-black">
                                            <img
                                                src={img?.path || default_image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = default_image;
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="flex justify-center">
                                <div className="flex mt-4 space-x-2 overflow-x-auto max-w-full">
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img?.path || default_image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded cursor-pointer ${selectedImage === index ? 'border-2 border-blue-500' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevents looping
                                                e.target.src = default_image;
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="flex items-center mb-4">
                              <span className="text-2xl font-bold text-blue-600 mr-2">
                                    {selectedVariant?.price || `${product.minPrice || 0} - ${product.maxPrice || 0}`} VND
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">Đã bán: {product.sold}</span>

                            <div className="flex items-center mb-4">

                                <div className="flex text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i}
                                                className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}/>
                                    ))}
                                </div>
                                <span
                                    className="text-sm text-gray-600">{Number(product?.rating || 0).toFixed(2)} ({comments.length} đánh giá)</span>
                            </div>
                            {product.isDiscount && (
                                <span
                                    className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold mb-4">Sale</span>
                            )}

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-2">Thông tin thêm:</h3>
                                <p className="text-sm text-gray-600 mb-1">Danh mục: {product.category.name}</p>
                                {/* Add more product details here */}
                            </div>
                            <VariantSelect
                                groupOptions={product.groupOptions}
                                selectedOptions={selectedOptions}
                                handleOptionSelect={handleOptionSelect}
                            />
                            <div className="flex space-x-4 mb-6 mt-2">
                                <button
                                    onClick={animateAddToCart}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center transform hover:scale-105 active:scale-95 duration-300"
                                >
                                    <FaShoppingCart className="mr-2"/> 
                                    <span className="relative">
                                        Thêm vào giỏ hàng
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform scale-0 transition-transform duration-300 group-hover:scale-100">
                                            +1
                                        </span>
                                    </span>
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors transform hover:scale-105 active:scale-95 duration-300"
                                >
                                    <FaHeart className="text-red-500"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
                        <div className="mb-6">
                            <form onSubmit={handleSubmitComment} className="mt-6">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={`cursor-pointer ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            onClick={() => setRating(index + 1)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Viết bình luận của bạn..."
                                    className="w-full p-2 border rounded-md"
                                    rows="4"
                                />
                                <div className="flex items-center mt-2">
                                    <label htmlFor="commentImage"
                                           className="cursor-pointer flex items-center text-blue-500 hover:text-blue-600">
                                        <FaUpload className="mr-2"/>
                                        Tải ảnh lên
                                    </label>
                                    <input
                                        type="file"
                                        id="commentImage"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                                {commentImage && (
                                    <div className="mt-2 relative">
                                        <img
                                            src={commentImage}
                                            alt="Comment preview"
                                            className="max-w-xs max-h-40 object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <FaTimes/>
                                        </button>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Gửi bình luận
                                </button>
                            </form>
                        </div>

                        {/* Display comments with ratings */}
                        <div className="space-y-4">
                            {comments.map((comment, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <span className="font-semibold mr-2">{comment.user.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <p>{comment.content}</p>
                                    {comment?.images?.length > 0 && (
                                        <img
                                            src={comment?.images[0]?.path || default_image}
                                            alt="Comment image"
                                            className="mt-2 max-w-xs max-h-40 object-contain"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Related Products Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: {slidesPerView: 2},
                                768: {slidesPerView: 3},
                                1024: {slidesPerView: 4},
                            }}
                            navigation
                            pagination={{clickable: true}}
                        >
                            {relatedProducts.map((item) => (
                                <SwiperSlide key={item.id} className="pb-12"> {/* Added padding-bottom */}
                                    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col"
                                         onClick={() => handleProductClick(item)}> {/* Added h-full and flex flex-col */}
                                        <img
                                            src={item.image && item.image.length > 0 ? item.image[0].path : '/path/to/default-image.jpg'}
                                            alt={item.name || 'Product Image'}
                                            className="w-full h-48 object-cover rounded-md mb-4 hover:scale-105 transition-transform transform cursor-pointer"
                                            onClick={() => handleProductClick(item)}
                                        />
                                        <h3 className="text-lg font-semibold mb-2 truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">{item.description}</p> {/* Added flex-grow */}
                                        <div
                                            className="flex justify-between items-center mt-auto"> {/* Added mt-auto */}
                                            <span className="font-bold text-blue-600">${item.minPrice}</span>
                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors">
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                    {isAnimating && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                                {isAddingToCart === 'loading' && (
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Đang thêm vào giỏ hàng...</h2>
                                        <p className="text-gray-600 mb-6">Vui lòng đợi trong giây lát.</p>
                                    </div>
                                )}
                                {isAddingToCart === 'success' && (
                                    <div className="text-center">
                                        <div className="inline-block text-green-500 mb-4">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Thêm vào giỏ hàng thành công!</h2>
                                        <p className="text-gray-600 mb-6">Sản phẩm đã được thêm vào giỏ hàng của bạn.</p>
                                    </div>
                                )}
                                {isAddingToCart === 'error' && (
                                    <div className="text-center">
                                        <div className="inline-block text-red-500 mb-4">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lỗi khi thêm vào giỏ hàng</h2>
                                        <p className="text-gray-600 mb-6">Đã xảy ra lỗi. Vui lòng thử lại sau.</p>
                                    </div>
                                )}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => setIsAnimating(false)}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </main>


            {/* Contact div */}
            <div id="contact" className="py-12 md:py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Thông tin liên hệ</h2>
                    <a href="mailto:library@university.edu"
                       className="bg-[#0b328f] text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#08367b] text-base md:text-lg transition-transform transform hover:scale-105">
                        <FaEnvelope size={20} className="inline mr-2"/> Gửi Email
                    </a>
                </div>
            </div>

            {/* Footer */}
            <HomeFooter/>
        </div>
    )
        ;
};

export default ProductDetail;