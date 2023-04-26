import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Categories = () => {
  // State variables
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [properties, setProperties] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  // Save category (create or update)
  const saveCategory = async (e) => {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties
        .map((p) => ({
          name: p.name.trim(),
          values: p.values.split(",").map((v) => v.trim()),
        }))
        .filter((p) => p.name !== "" && p.values.length > 0),
    };
    if (editedCategory) {
      // Update existing category
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      // Create new category
      await axios.post("/api/categories", data);
    }
    // Reset form and fetch categories
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  };

  // Set edited category (for editing)
  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = (category) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id);
        Swal.fire("Deleted!", "The category has been deleted.", "success");
        fetchCategories();
      }
    });
  };

  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };

  const handlePropertyNameChange = (index, prop, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;

      return properties;
    });
  };

  const handlePropertyValuesChange = (index, prop, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;

      return properties;
    });
  };

  const removeProperty = (index) => {
    setProperties((prev) => {
      const newProperties = [...prev];
      newProperties.splice(index, 1);
      return newProperties;
    });
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name} `
          : "Create new category"}
      </label>
      {/* Category form */}
      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1">
          {/* Category name input */}
          <input
            className="mb-0"
            type="text"
            placeholder={"Category name"}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {/* Parent category select */}
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="0">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((prop, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  value={prop.name}
                  onChange={(e) =>
                    handlePropertyNameChange(index, prop, e.target.value)
                  }
                  placeholder="property name (example : color)"
                />
                <input
                  value={prop.values}
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyValuesChange(index, prop, e.target.value)
                  }
                  type="text"
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  className="btn-red"
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default Categories;
