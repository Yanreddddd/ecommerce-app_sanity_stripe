import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  // Declaration of global variable
  let foundProduct;
  let index;

  //  Cart Items addition logic
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to cart.`);
  };
  // Cart items removal logic
  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  //  Toggle increase and decrease cart items logic
  // I used math.max to fix the negative quantity bug in the cart items quantity, it limits the cart item to 0 when decrementing
  // I found .splice to fix the misbehavior of the cart items logic
  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);

    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      // setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1} ]); buggy code
      // The code below is the fix to the buggy code
      newCartItems.splice(index, 0, {
        ...foundProduct,
        quantity: Math.max(1, foundProduct.quantity + 1),
      });

      setCartItems(newCartItems);

      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity >= 1)
        // setCartItems([...newCartItems, { ...foundProduct, quantity: Math.max(1,foundProduct.quantity - 1)} ]); buggy code
        // The code below is the fix to the buggy code
        newCartItems.splice(index, 0, {
          ...foundProduct,
          quantity: Math.max(1, foundProduct.quantity - 1),
        });

      setCartItems(newCartItems);
      setTotalPrice((prevTotalPrice) =>
        Math.max(foundProduct.price, prevTotalPrice - foundProduct.price)
      );
      setTotalQuantities((prevTotalQuantities) =>
        Math.max(1, prevTotalQuantities - 1)
      );
    }
  };
  //   Increase and Decrease cart quantity logic
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 <= 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
