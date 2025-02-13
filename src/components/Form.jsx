import { useState, useEffect } from "react";
import CardForm from "./CardForm"; // Assuming you have a CardForm component
import styles from "./cssc/Form.module.css";

const Form = ({ onSave }) => {
  const [formData, setFormData] = useState({
    dishName: "",
    category: "",
    time: "",
    rating: "",
    image: "",
    steps: [""],
  });
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    setCards(savedCards);
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const removeStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCard = { ...formData };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    setFormData({
      dishName: "",
      category: "",
      time: "",
      rating: "",
      image: "",
      steps: [""],
    });
  };

  const handleEdit = (index, updatedCard) => {
    const updatedCards = cards.map((card, i) =>
      i === index ? updatedCard : card
    );
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  const handleDelete = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        {cards.map((card, index) => (
          <CardForm
            key={index}
            {...card}
            onEdit={(updatedCard) => handleEdit(index, updatedCard)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="dishName"
          placeholder="Dish Name"
          value={formData.dishName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="time"
          placeholder="Time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className={styles.imagePreview}
          />
        )}
        <div className={styles.stepsContainer}>
          <h4>Instructions:</h4>
          {formData.steps.map((step, index) => (
            <div key={index} className={styles.stepInput}>
              <textarea
                placeholder={`Step ${index + 1}`}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                required
              />
              {formData.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className={styles.deleteStepButton}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className={styles.addStepButton}
          >
            Add Step
          </button>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Form;
