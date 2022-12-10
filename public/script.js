const CHECKOUT_OPTIONS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    items: [
      // items in the shopping cart
      { id: 1, qty: 3 },
      { id: 2, qty: 1 },
    ],
  }),
};

const checkout = async () => {
  try {
    const res = await fetch("/create-checkout-session", CHECKOUT_OPTIONS);
    const data = await res.json();
    if (res.ok) {
      window.location = data.url;
    } else {
      throw new Error(data.error);
    }
  } catch (e) {
    console.error(e.message);
  }
};

const checkoutBtn = document.querySelector("button");
checkoutBtn.addEventListener("click", checkout);
