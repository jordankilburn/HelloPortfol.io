import { useState } from "react";
import Modal from "../components/Modal";
import { BasePortfolioAsset } from "../types";
import { addDoc, collection } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { firestore } from "../firebase/clientApp";
import { toast } from "react-toastify";

type Props = {
  basePortfolioAssets: BasePortfolioAsset[];
  buttonText?: string;
};
export default function Share({
  basePortfolioAssets,
  buttonText = "Share",
}: Props) {
  const [openShare, setOpenShare] = useState(false);
  const [shareName, setShareName] = useState("");
  const [sharedLink, setSharedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const sharePortfolio = async () => {
    setLoading(true);
    if (shareName.length < 1) {
      setLoading(false);
      return toast.error("Type a name for your portfolio");
    }
    // get the current timestamp
    const timestamp: Date = new Date();

    // const auth = getAuth();
    // signInAnonymously(auth)
    //   .then(() => {

    const dbInstance = collection(firestore, "anon-portfolios");

    console.log({
      pid: shareName,
      timestamp,
      portfolio: basePortfolioAssets,
    });
    
    addDoc(dbInstance, {
      pid: shareName,
      timestamp,
      portfolio: basePortfolioAssets,
    })
      .then((res) => {
        setLoading(false);
        setSharedLink(`helloportfol.io/p/${res.id}`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        //show an error message
        toast.error("An error occurred :(");
      });
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.log(error);
    //   setLoading(false);
    //   //show an error message
    //   toast.error(errorMessage);
    //   // ...
    // });
  };

  return (
    <>
      <button className="share-button" onClick={() => setOpenShare(true)}>
        {buttonText}
      </button>

      {openShare && (
        <Modal
          customClass={""}
          headline={"Share This Portfolio"}
          body={
            <div style={{ maxWidth: 350, margin: "auto" }}>
              <p>
                Give your portfolio a name and click share! ANYONE with this
                link will be able to view (but not edit) this portfolio.
              </p>
              <input
                name="shareName"
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
                placeholder="e.g. Sick Gains Portfolio"
              />
              {sharedLink.length ? (
                <div style={{ marginTop: 20 }}>
                  Share this link: <b>{sharedLink}</b>
                </div>
              ) : (
                ""
              )}
              <button
                disabled={loading}
                style={{ marginTop: 20, width: "100%" }}
                className="share-button"
                onClick={() => {
                  sharePortfolio();
                }}
              >
                Share
              </button>
            </div>
          }
          open={openShare}
          setOpen={setOpenShare}
        />
      )}
    </>
  );
}
