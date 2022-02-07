import { useState } from "react";
import Modal from "../components/Modal";
import { ExportToCsv } from "export-to-csv";
import { toast } from "react-toastify";

var exampleData = [
  {
    "Asset Type": "Real Estate",
    "Ticker / Address / Name": "17911 Shadow Oak",
    "Quantity / Shares": 2,
    Value: 130000,
  },
  {
    "Asset Type": "Crypto",
    "Ticker / Address / Name": "BTC",
    "Quantity / Shares": 2,
    Value: "Autotracked.",
  },
  {
    "Asset Type": "Liability",
    "Ticker / Address / Name": "Home Loan",
    "Quantity / Shares": 1,
    Value: 100000,
  },
  {
    "Asset Type": "Crypto",
    "Ticker / Address / Name": "ETH",
    "Quantity / Shares": 2,
    Value: "Autotracked.",
  },
];

const options = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

export default function CsvReader({
  basePortfolioAssets,
  assetTypes,
  setBasePortfolioAssets,
}) {
  const [open, setOpen] = useState(false);
  const csvExporter = new ExportToCsv(options);

  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]

  const processCSV = (str, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });
    addAssets(newArray);
    //parse inputs and add them.
  };

  const addAssets = (assets) => {
    let totalCount = basePortfolioAssets.length;
    let newAssets = [];
    const keys = Object.keys(assets[0]);
    for (let i = 0; i < assets.length; i++) {
      if (totalCount >= 20)
        return toast.error("You can only track up to 20 items right now.");
      const asset = assets[i];
      const type = asset[keys[0]];
      const chosenType = assetTypes.find((a) => type.includes(a.type));
      if (chosenType) {
        //if a valid type
        newAssets.push({
          account: "Default Account",
          type: type,
          ticker: asset[keys[1]],
          shares: Number(asset[keys[2]]),
          value: Number(asset[keys[3]]),
          show: true,
        });
      }
    }
    setBasePortfolioAssets([...newAssets, ...basePortfolioAssets]);
    totalCount++;
  };

  const submit = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      processCSV(text);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Upload CSV</button>
      <button
        onClick={() =>
          csvExporter.generateCsv(
            basePortfolioAssets.map(
              ({ account, show, roi, nickname, ...keepAttrs }) => keepAttrs
            )
          )
        }
      >
        Download as CSV
      </button>
      {open && (
        <Modal
          headline={"Upload CSV"}
          body={
            <>
              You can upload all your assets/liabilities in a single file!
              <br />
              <br />
              You need to upload a csv with 4 columns (order sensitive):
              <div style={{ margin: "1rem 0" }}>
                1. <b>Asset Type</b>: Valid Asset Types (as of now) are:
                <br />{" "}
                {assetTypes.map((e) => {
                  return `"${e.type}", `;
                })}
                <br />
                <br />
                2. <b>Ticker / Address / Name</b>: This is the stock/crypto
                ticker, the address/token for an NFT, or custom name or address
                for everything else. This must be unique or it will overwrite
                the existing item with the same name/ticker.
                <br />
                <br />
                3. <b>Quantity / Shares</b>
                <br />
                <br />
                4. <b>Value (optional)</b>: Value is not needed for assets of
                type Stock, Crypto, or NFT as they are tracked.
              </div>
              <br />
              <br />
              <button onClick={() => csvExporter.generateCsv(exampleData)}>
                Download an Example
              </button>
              <label htmlFor='csvFile' className='file-upload green-button'>
                Choose CSV
              </label>
              <input
                style={{ display: "none" }}
                className='upload-button'
                type='file'
                accept='.csv'
                id='csvFile'
                onChange={(e) => {
                  submit(e.target.files[0]);
                }}
              />
            </>
          }
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  );
}
