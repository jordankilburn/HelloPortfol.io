import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Modal } from "react-responsive-modal";
import { toast } from "react-toastify";
import { basePortfolioAssetsState, sortedByState } from "../recoil_states";
import toLocaleFixed from "../utils/toLocaleFixed";
import supportedCryptos from "../utils/supportedCryptos";
const assetTypes = [
  {
    type: "Stock",
    shares: "Shares",
    ticker: "Ticker",
    tickerPlaceholder: "AAPL",
    value: "tracked",
  },
  {
    type: "Crypto",
    shares: "Coins",
    ticker: "Ticker",
    tickerPlaceholder: "ETH",
    value: "tracked",
  },
  {
    type: "NFT",
    shares: null,
    nickname: "Nickname",
    ticker: "Address/Token",
    tickerPlaceholder: "0xd07...430/3423",
    value: "tracked",
  },
  {
    type: "Real Estate",
    shares: null,
    ticker: "Address",
    tickerPlaceholder: "1 Hacker Way, Menlo Park, CA 94025",
  },
  {
    type: "Private Business",
    shares: null,
    ticker: "Business Name",
    tickerPlaceholder: "Meta Inc",
  },
  {
    type: "Other Asset",
    shares: null,
    ticker: "Name",
    tickerPlaceholder: "Jordan Rookie Card",
  },
];

export default () => {
  const [basePortfolioAssets, setBasePortfolioAssets] = useRecoilState(
    basePortfolioAssetsState
  );

  const [sortedBy, setSortedBy] = useRecoilState(sortedByState);

  const [open, setOpen] = useState(false);
  const [openLiability, setOpenLiability] = useState(false);
  const [openRemove, setOpenRemove] = useState(null);
  const [inputs, setInputs] = useState({ type: "Crypto" });

  const handleChange = (e) =>
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const handleAddLiability = () => {
    let error = "";
    toast.clearWaitingQueue();
    toast.dismiss();

    if (!inputs.nickname) error = `Type a liability name, please.`;
    else if (!inputs.value || inputs.value <= 0)
      error = `Please include a positive value.`;
    if (error !== "") return toast.error(error);

    //add to portfolio
    setBasePortfolioAssets([
      {
        account: "Default Account",
        type: "Liability",
        ticker: inputs.nickname,
        shares: 1,
        nickname: inputs.nickname,
        value: -1 * Number(inputs.value),
        show: true,
      },
      ...basePortfolioAssets,
    ]);

    //reset inputs
    setInputs({});
    setOpenLiability(false);
    return toast.success(`Added ${inputs.nickname}!`);
  };
  const handleAddAsset = () => {
    let error = "";
    toast.clearWaitingQueue();
    toast.dismiss();

    const chosenType = assetTypes.find((a) => a.type === inputs.type);

    // if (!inputs.account) error = "Please include account name.";

    if (!inputs.type || !chosenType) error = "Please choose asset type.";
    else if (!inputs.ticker)
      error = `Please include ${inputs.type} ${chosenType.ticker}`;
    else if (chosenType.shares && !inputs.shares)
      error = "Please include asset " + chosenType.shares;
    else if (chosenType.shares && inputs.shares <= 0)
      error = `Positive value for ${chosenType.shares}, please`;
    else if (chosenType.nickname && !inputs.nickname)
      error = `Choose a ${chosenType.nickname}, please`;
    else if (chosenType.value !== "tracked" && !inputs.value)
      error = `Place a value on your ${chosenType.type}, please`;
    let foundCrypto = {};
    if (inputs.type === "Crypto") {
      foundCrypto = supportedCryptos.find(
        (x) => x.symbol.toLowerCase() === inputs.ticker.toLowerCase()
      );
      if (!foundCrypto) error = `Cannot find ${inputs.ticker}.`;
    }
    if (error !== "") return toast.error(error);

    //add to portfolio
    setBasePortfolioAssets([
      {
        account: "Default Account",
        type: inputs.type,
        ticker: foundCrypto.id || inputs.ticker,
        shares: inputs.shares || 1,
        nickname: inputs.nickname,
        value: Number(inputs.value),
        show: true,
      },
      ...basePortfolioAssets,
    ]);

    //reset inputs
    setInputs({});
    setOpen(false);
    return toast.success(`Added ${inputs.ticker}!`);
  };

  const sortBy = (sortType) => {
    const newSort = JSON.parse(JSON.stringify(basePortfolioAssets));
    switch (sortType) {
      case "Value":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.value - a.value)
          : newSort.sort((a, b) => a.value - b.value);
        break;
      case "Ticker":
        sortedBy === "asc"
          ? newSort.sort((a, b) => a.ticker.localeCompare(b.ticker))
          : newSort.sort((a, b) => b.ticker.localeCompare(a.ticker));
        break;
      case "Shares":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.shares - a.shares)
          : newSort.sort((a, b) => a.shares - b.shares);
        break;
      case "ROI":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.roi - a.roi)
          : newSort.sort((a, b) => a.roi - b.roi);
        break;
      case "Type":
        sortedBy === "asc"
          ? newSort.sort((a, b) => a.type.localeCompare(b.type))
          : newSort.sort((a, b) => b.type.localeCompare(a.type));
        break;

      default:
        return;
    }
    setSortedBy(sortedBy === "asc" ? "desc" : "asc");
    setBasePortfolioAssets(newSort);
  };

  return (
    <>
      <div className="row">
        <div className="item">
          <h2>Manage Assets</h2>
          {/* <p>Add/Remove assets from portfolio</p> */}
          {basePortfolioAssets.length < 20 ? (
            <p>
              <button className="green-button" onClick={() => setOpen(true)}>
                Add Asset
              </button>
            </p>
          ) : (
            <p>You can only track up to 20 items (for now...)</p>
          )}
          {basePortfolioAssets.length > 0 && (
            <div
              className="table-wrapper"
              style={{ maxHeight: "100%", overflow: "auto" }}
            >
              <table style={{ width: "100%" }}>
                <thead style={{ textAlign: "left" }}>
                  <tr>
                    <th></th>
                    {/* <th>Account</th> */}
                    <th>Asset</th>
                    <th onClick={() => sortBy("Type")}>Type</th>
                    <th onClick={() => sortBy("Shares")}>QTY</th>
                    <th onClick={() => sortBy("Value")}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {basePortfolioAssets
                    .filter((x) => x.type !== "Liability")
                    .map((asset, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <button
                              className="x-button"
                              onClick={() => {
                                setOpenRemove(asset);
                              }}
                            >
                              ✖
                            </button>{" "}
                          </td>
                          {/* <td>{asset.account}</td> */}
                          <td>{asset.nickname || asset.ticker}</td>
                          <td>{asset.type}</td>
                          <td>{toLocaleFixed(asset.shares, 3)}</td>
                          <td>${toLocaleFixed(asset.value)}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td></td>
                    <td>
                      {" "}
                      <b className="green">Total:</b>
                    </td>
                    <td></td> <td></td>
                    <td>
                      <b className="green">
                        $
                        {toLocaleFixed(
                          basePortfolioAssets
                            .filter((x) => x.type !== "Liability")
                            .reduce((a, b) => a + (b.value || 0), 0)
                        )}
                      </b>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="item">
          <h2>Manage Liabilities</h2>
          {basePortfolioAssets.length < 20 && (
            <p>
              <button
                className="red-button"
                onClick={() => setOpenLiability(true)}
              >
                Add Liability
              </button>
            </p>
          )}

          {basePortfolioAssets.filter((x) => x.type === "Liability").length >
            0 && (
            <div
              className="table-wrapper"
              style={{ maxHeight: "100%", overflow: "auto" }}
            >
              <table style={{ width: "100%" }}>
                <thead style={{ textAlign: "left" }}>
                  <tr>
                    {/* <th>Account</th> */}
                    <th></th>
                    <th>Liability</th>
                    {/* <th onClick={() => sortBy("Type")}>Type</th> */}
                    {/* <th onClick={() => sortBy("Shares")}>QTY</th> */}
                    <th onClick={() => sortBy("Value")}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {basePortfolioAssets
                    .filter((x) => x.type === "Liability")
                    .map((asset, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <button
                              className="x-button"
                              onClick={() => {
                                setOpenRemove(asset);
                              }}
                            >
                              ✖
                            </button>{" "}
                          </td>
                          <td>{asset.nickname || asset.ticker}</td>
                          {/* <td>{asset.type}</td> */}
                          {/* <td>{toLocaleFixed(asset.shares, 3)}</td> */}
                          <td>${toLocaleFixed(asset.value)}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td></td>
                    <td>
                      {" "}
                      <b className="red">Total:</b>
                    </td>
                    {/* <td></td> */}
                    <td>
                      <b className="red">
                        $
                        {toLocaleFixed(
                          basePortfolioAssets
                            .filter((x) => x.type === "Liability")
                            .reduce((a, b) => a + (b.value || 0), 0)
                        )}
                      </b>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        closeOnEsc={false}
        closeOnOverlayClick={false}
        classNames={{
          // overlay: 'customOverlay',
          modal: "customModal",
        }}
      >
        <div>
          <h2>Add Asset</h2>
          <div className="add-asset-form">
            {/* <div>
              Account Name
              <input
                name="account"
                value={inputs.account || ""}
                onChange={handleChange}
                placeholder="Robinhood"
              />
            </div> */}
            <div>
              Asset Type
              <select name="type" onChange={handleChange} value={inputs.type}>
                <option value={null}></option>
                {assetTypes.map((a) => (
                  <option key={a.type} value={a.type}>
                    {a.type}
                  </option>
                ))}
              </select>
            </div>
            {assetTypes.map((a) => {
              if (a.type !== inputs.type) return null;
              if (!a.ticker) return null;

              return (
                <div key={a.ticker}>
                  {a.ticker}
                  <span style={{ display: "flex" }}>
                    <input
                      name="ticker"
                      value={inputs.ticker || ""}
                      onChange={handleChange}
                      placeholder={a.tickerPlaceholder}
                      autoComplete="off"
                    />
                    {/* <button className="search">🔍</button> */}
                  </span>
                </div>
              );
            })}
            {assetTypes.map((a) => {
              if (a.type !== inputs.type) return null;
              if (a.nickname)
                return (
                  <div key={a.ticker}>
                    Nickname
                    <input
                      name="nickname"
                      value={inputs.nickname || ""}
                      onChange={handleChange}
                    />
                  </div>
                );
              if (!a.shares)
                return (
                  <div key={a.ticker}>
                    Value
                    <input
                      name="value"
                      value={inputs.value || 1}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                );

              return (
                <div key={a.ticker}>
                  {a.shares}
                  <input
                    name="shares"
                    value={inputs.shares || 1}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              );
            })}
          </div>
          <button
            style={{ marginTop: 20, width: "100%" }}
            className="green-button"
            onClick={handleAddAsset}
          >
            Add to Portfolio
          </button>
        </div>
      </Modal>
      {openRemove !== null && (
        <Modal
          open={openRemove}
          onClose={() => setOpenRemove(null)}
          center
          // closeOnEsc={false}
          // closeOnOverlayClick={false}
          classNames={{
            // overlay: 'customOverlay',
            modal: "customModal",
          }}
        >
          <div>
            <h2>Remove {openRemove.nickname || openRemove.ticker}?</h2>
            <div className="add-asset-form">
              <button
                style={{ marginTop: 20, width: "100%" }}
                className="red-button"
                onClick={() => {
                  setBasePortfolioAssets(
                    basePortfolioAssets.filter(
                      (x) => x.ticker !== openRemove.ticker
                    )
                  );
                  setOpenRemove(null);
                }}
              >
                Yes, remove {openRemove.nickname || openRemove.ticker} from my
                portfolio!
              </button>
            </div>
          </div>
        </Modal>
      )}
      {openLiability !== null && (
        <Modal
          open={openLiability}
          onClose={() => setOpenLiability(null)}
          center
          closeOnEsc={false}
          closeOnOverlayClick={false}
          classNames={{
            // overlay: 'customOverlay',
            modal: "customModal",
          }}
        >
          <div>
            <h2>Add Liability</h2>
            <div className="add-asset-form">
              <div>
                Liability Name
                <input
                  name="nickname"
                  value={inputs.nickname || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                Liability Value
                <input
                  name="value"
                  value={inputs.value || 1}
                  onChange={handleChange}
                  type={"number"}
                />
              </div>
            </div>
            <button
              style={{ marginTop: 20, width: "100%" }}
              className="red-button"
              onClick={handleAddLiability}
            >
              Add to Portfolio
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
