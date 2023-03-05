import React, { useEffect } from "react";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* REACT BOOTSTRAP */
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";

/* COMPONENTS */
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { createOrder } from "../actions/orderActions";

/* ACTION TYPES */
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const priceshipping={
"Adrar":800,
"Chlef":400,
"Laghouat":600,
"Oum El Bouaghi":350,
"Béjaïa":400,
"Biskra":350,
"Béchar":800,
"Blida":350,
"Bouira":400,
"Tamanrasset":1000,
"Tébessa":600,
"Tlemcen":350,
"Tiaret":400,
"Tizi Ouzou":400,
"Alger":350,
"Djelfa":600,
"Jijel":400,
"Sétif":350,
"Saïda":400,
"Skikda":400,
"Sidi Bel Abbès":400,
"Annaba":350,
"Guelma":400,
"Constantine":400,
"Médéa":400,
"Mostaganem":400,
"M'Sila":350,
"Mascara":400,
"Ouargla":600,
"Oran":350,
"El Bayadh":600,
"Illizi":1200,
"Bordj Bou Arreridj":400,
"Boumerdès":400,
"El Tarf":400,
"Tindouf":1000,
"Tissemsilt":400,
"El Oued":600,
"Khenchela":350,
"Souk Ahras":400,
"Tipaza":350,
"Mila":350,
"Aïn Defla":400,
"Naâma":800,
"Aïn Témouchent":400,
"Ghardaïa":600,
"Relizane":400,}
function PlaceOrderScreen({ history }) {
  const dispatch = useDispatch();

  /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  const orderCrate = useSelector((state) => state.orderCreate);

  const { order, error, success } = orderCrate;

  const cart = useSelector((state) => state.cart);

  // PRICE CALCULATIONS, WE ARE SETTING AN ATTRIBUTE TO OUR CART OBJECT BUT IT WON'T UPDATE OUR STATE, IT'S JUST FOR THIS PAGE
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  cart.shippingPrice = (priceshipping[cart.shippingAddress.city.toUpperCase()] ? priceshipping[cart.shippingAddress.city.toUpperCase()]:700).toFixed(2);

  cart.taxPrice = Number(0.00 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  // REDIRECT
  if (!cart.paymentMethod) {
    history.push("/payment");
  }

  /* IF ORDER SUCCESSFULL AND WE HAVE ORDER ID, SEND USER TO USERS ACCOUNT TO VIEW THE ORDER */
  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);

      // RESET STATE
      dispatch({
        type: ORDER_CREATE_RESET,
      });
    }
    // eslint-disable-next-line
  }, [success, history]);

  // HANDLERS
  const placeorder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Shipping Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>

              <p>
                <strong>Payment Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={process.env.REACT_APP_API_URL+item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X {item.price} DZ= 
                          {(item.qty * item.price).toFixed(2)}DZ
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>

                  <Col>{cart.itemsPrice}DZ</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>

                  <Col>{cart.shippingPrice}DZ</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>

                  <Col>{cart.taxPrice}DZ</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>

                  <Col>{cart.totalPrice}DZ</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100"
                  disabled={cart.cartItems === 0}
                  onClick={placeorder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
