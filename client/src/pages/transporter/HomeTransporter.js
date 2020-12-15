import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchTransporter, fetchTransporterById } from "../../store/index";
import { NavbarTrans } from "../../components";

function HomeTransporter(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const transporter = useSelector((state) => state.dataTransporter);
  const trucking = useSelector((state) => state.transporter);
  const transporterId = +localStorage.getItem("transporterId");
<<<<<<< HEAD
  console.log(transporter, "tra");
=======
  console.log(transporter, 'tra');
  console.log(transporter, 'transporter', trucking, 'trucking', transporterId, 'transporterId')

>>>>>>> b8c8629cdcb4a873d1985460a1455db0bbd93ce3
  useEffect(() => {
    dispatch(fetchTransporter());
    dispatch(fetchTransporterById(transporterId));
  }, [dispatch]);

  const changePage = (id) => {
    history.push(`/transporter/${id}`);
  };

<<<<<<< HEAD
  const toControlPage = (ShipperId) => {
=======
  const toControlPage = (ShipperId, postId, bidId) => {
    // const payload = {
    //   BidId: bidId,
    //   id: postId
    // }

    // dispatch({
    //   type: "SET_BID_ID_POST_ID",
    //   payload: payload,
    // })
>>>>>>> b8c8629cdcb4a873d1985460a1455db0bbd93ce3
    history.push(
      `/controlPage/transporter_${trucking.username}_${trucking.id}_${trucking.email}_${ShipperId}`
    );
  };

<<<<<<< HEAD
  // const filterBid = transporter.filter((el) => {
=======
    // const filterBid = transporter.filter((el) => {
>>>>>>> b8c8629cdcb4a873d1985460a1455db0bbd93ce3
  //   return el.id ==
  // })

  // console.log(filterBid, 'feltier')
  return (
    <>
<<<<<<< HEAD
      <NavbarTrans />
=======
      <NavbarTrans/>
>>>>>>> b8c8629cdcb4a873d1985460a1455db0bbd93ce3
      {/* {JSON.stringify(transporter)} */}
      <h1 className="text-center">Find the right order for you!</h1>
      <div className="row">
        {transporter.map((el, key) => (
          <div key={key} className="card-deck mx-auto col-sm-4">
            <div id="card-size" className="card">
              <div className="card-body mt-2 text-center mx-auto">
                <h5>{el.product_name}</h5>
                {/* <h5>{JSON.stringify(el.Posts[0])}</h5> */}
                {console.log(transporter[0].ShipperId, "awa")}
                <img
                  className="card-img-top"
                  src={el.product_picture}
                  style={{ width: 150, height: 150 }}
                ></img>
                <h5 className=" mt-2">{el.description}</h5>
                <h5 className=" mt-2">{el.from}</h5>
                <h5 className=" mt-2">{el.to}</h5>
                {el.Posts.map((post) => (
                  <p>{post.status}</p>
                ))}
                {el.Posts.some(
                  (post) => post.TransporterId === transporterId
                ) ? (
                  el.Posts.some((post) => post.status === "accepted") ? (
                    <button
                      onClick={() => toControlPage(el.ShipperId)}
                      className="btn btn-primary"
                    >
                      Start
                    </button>
                  ) : (
                    ""
                  )
                ) : el.Posts.some((post) => (post.status = "accepted")) ? (
                  ""
                ) : (
                  <button
                    onClick={() => changePage(el.id)}
                    className="btn btn-danger"
                  >
                    Bid !
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default HomeTransporter;
