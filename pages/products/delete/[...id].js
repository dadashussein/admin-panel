import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DeleteProduct = () => {
  const [productInfo, setProductInfo] = useState();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  const goBack = () => {
    router.push("/products");
  };

  const deleteProduct = async () => {
    await axios.delete("/api/products?id=" + id);
    goBack();
  };

  return (
    <Layout>
      <h1 className="text-center">
        &nbsp;{productInfo?.title} məhsulunu silmək istəyirsiniz?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red" type="submit">
          Bəli
        </button>
        <button className="btn-default" onClick={goBack} type="submit">
          Xeyr
        </button>
      </div>
    </Layout>
  );
};

export default DeleteProduct;
