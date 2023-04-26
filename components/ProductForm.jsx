import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
//spinner
import { PuffLoader } from "react-spinners";
import Image from "next/image";

const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) => {
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUpLoading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //uptade
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };
  if (goToProducts) {
    router.push("/products");
  }

  const uploadPhoto = async (e) => {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUpLoading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUpLoading(false);
    }
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  const setProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo && catInfo.properties) {
      propertiesToFill.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        if (parentCat && parentCat.properties) {
          propertiesToFill.push(...parentCat.properties);
          catInfo = parentCat;
        } else {
          break;
        }
      }
    }
  }

  return (
    <div>
      <form className="flex flex-col" onSubmit={saveProduct}>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Category</label>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((cat) => (
              <option key={cat} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((prop) => (
            <div className="" key={prop.name}>
              <label>
                {prop.name[0].toUpperCase() + prop.name.substring(1)}
              </label>
              <div>
                <select
                  value={productProperties[prop.name]}
                  onChange={(e) => setProductProp(prop.name, e.target.value)}
                >
                  {prop.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-1 ">
          <ReactSortable
            className="flex flex-wrap gap-1 "
            list={images}
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((link) => (
                <div
                  className="h-24 bg-white p-4 shadow-sm rounded-md border border-r-gray-200"
                  key={link}
                >
                  <Image
                    width={50}
                    height={50}
                    loading="lazy"
                    src={link}
                    className="rounded-lg"
                    alt={link.length}
                  />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 p-1  flex items-center">
              <PuffLoader color="#1E3A8A" />
            </div>
          )}
          <label className="cursor-pointer shadow-sm text-gray-500 rounded-lg bg-white text-sm gap-1 w-24 h-24 flex-col border border-gray-200 text-center flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Add image</div>
            <input onChange={uploadPhoto} type="file" className="hidden" />
          </label>
        </div>
        <label>Açıqlama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="desc"
        ></textarea>
        <label>Qiymət (azn)</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          placeholder="qiymət"
        />
        <button type="submit" className="btn-primary">
          Yaddaşda saxla
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
