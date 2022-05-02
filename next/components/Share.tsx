import { useState } from "react";
import Modal from "../components/Modal";
import { BasePortfolioAsset } from "../types";
import { toast } from "react-toastify";
import slugify from "../utils/slugify";

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

    fetch("/api/share", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: shareName,
        portfolio: basePortfolioAssets,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.error) return toast.error(res.error);

        setLoading(false);
        setSharedLink(`helloportfol.io/p/${res.id}`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("An error occurred :(");
      });
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
