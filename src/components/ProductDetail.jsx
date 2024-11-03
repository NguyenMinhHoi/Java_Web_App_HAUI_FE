import React, {useState, useEffect, useRef} from 'react';
import {Link, useParams} from 'react-router-dom';
import {
    FaStar,
    FaShoppingCart,
    FaHeart,
    FaBars,
    FaSearch,
    FaClock,
    FaChevronRight,
    FaBookOpen,
    FaBookmark, FaUsers, FaGraduationCap, FaEnvelope, FaFacebookF, FaYoutube, FaGoogle
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useAxiosSupport from '../hooks/useAxiosSupport';
import {FiArrowDown, FiArrowUp} from "react-icons/fi";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import default_image from '../assets/images/default-image.svg';

const ProductDetail = () => {
  const { id } = useParams();
  const axiosSupport = useAxiosSupport();
  const swiperRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [images,setImages] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if(selectedOptions.length === groupOptions.length) {
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

                // Initialize images with product images
                const productImages = res.product.image || [];
                let allImages = [...productImages]

                // Set related products if available
                if (res.relatedProducts) {
                    setRelatedProducts(res.relatedProducts);
                }

                if (res.variants) {
                    setVariants(res.variants);
                    // Add variant images to allImages
                    res.variants.forEach(variant => {
                        if (variant.image && !allImages.some(img => img.id === variant.image.id)) {
                            allImages.push(variant.image);
                        }
                    });
                }

                if(res.groupOptions) {
                    setGroupOptions(res.groupOptions);
                }

                setImages(allImages);

                setSelectedImage(0);

                const fakeComments = [
                    { id: 1, userName: "John Doe", content: "Great product! Exceeded my expectations.", createdAt: "2023-05-15T10:30:00Z" },
                    { id: 2, userName: "Jane Smith", content: "Good value for money. I'm satisfied with my purchase.", createdAt: "2023-05-14T14:45:00Z" },
                    { id: 3, userName: "Mike Johnson", content: "The camera quality is amazing. Highly recommended!", createdAt: "2023-05-13T09:15:00Z" },
                ];

                setComments(fakeComments);

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

    const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log("Added to cart:", product.name);
  };

  const handleAddToWishlist = () => {
    // Implement add to wishlist functionality
    console.log("Added to wishlist:", product.name);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    // try {
    //   // Assuming there's an API to submit a new comment
    //   await axiosSupport.addProductComment(id, newComment);
    //   const updatedComments = await axiosSupport.getProductComments(id);
    //   setComments(updatedComments);
    //   setNewComment('');
    // } catch (error) {
    //   console.error("Error submitting comment:", error);
    // }
  };

    const [selectedVariant, setSelectedVariant] = useState(null);




    if (!product) return <div>Loading...</div>;

    const handleOptionSelect = (groupName, optionName) => {
        const prevOptions = {...selectedOptions,[groupName]: optionName};
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


  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
          <HomeHeader/>

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

                              <span className="text-sm text-gray-600">{product.rating} ({product.sold} đánh giá)</span>
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
                          <div className="my-6 border-t border-b py-4">
                              <h3 className="text-lg font-semibold mb-3">Chọn phân loại:</h3>
                              {product.groupOptions.map((groupOption, groupIndex) => (
                                  <div key={`group-${groupIndex}`} className="mb-4">
                                      <h4 className="text-md font-medium mb-2">{groupOption.name}:</h4>
                                      <div className="flex flex-wrap gap-2">
                                          {groupOption.options.map((option, optionIndex) => (
                                              <button
                                                  key={`option-${groupIndex}-${optionIndex}`}
                                                  className={`px-4 py-2 border rounded-full hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                      selectedOptions[groupOption.name] === option.name ? 'bg-blue-500 text-white' : ''
                                                  }`}
                                                  onClick={() => handleOptionSelect(groupOption.name, option.name)}
                                              >
                                                  {option.name}
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <div className="flex space-x-4 mb-6">
                              <button
                                  onClick={handleAddToCart}
                                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                              >
                                  <FaShoppingCart className="mr-2"/> Thêm vào giỏ hàng
                              </button>
                              <button
                                  onClick={handleAddToWishlist}
                                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors"
                              >
                                  <FaHeart/>
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-12">
                      <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
                      <div className="mb-6">
                          <form onSubmit={handleSubmitComment}>
                            <textarea
                                className="w-full p-2 border rounded-md"
                                rows="3"
                                placeholder="Viết đánh giá của bạn..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>
                              <button
                                  type="submit"
                                  className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                              >
                              Gửi đánh giá
                              </button>
                          </form>
                      </div>
                      <div className="space-y-4">
                          {comments.map((comment, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-md">
                                  <div className="flex items-center mb-2">
                                      <span className="font-semibold mr-2">{comment.userName}</span>
                                      <span
                                          className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p>{comment.content}</p>
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
                                  <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
                                      <img
                                          src={item.image && item.image.length > 0 ? item.image[0].path : '/path/to/default-image.jpg'}
                                          alt={item.name || 'Product Image'}
                                          className="w-full h-48 object-cover rounded-md mb-4"
                                      />
                                      <h3 className="text-lg font-semibold mb-2 truncate">{item.name}</h3>
                                      <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">{item.description}</p> {/* Added flex-grow */}
                                      <div className="flex justify-between items-center mt-auto"> {/* Added mt-auto */}
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