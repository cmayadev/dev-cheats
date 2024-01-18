import React, { useState, useEffect } from "react";
import Tool from "../../components/layout/Tool/Tool";
import { LoremIpsum } from "react-lorem-ipsum";

const LoremIpsumGenerator = (props) => {
  const [count, setCount] = useState(5);
  const [selectedOption, setSelectedOption] = useState("paragraphs");
  const [loremText, setLoremText] = useState("");
  const { setSidebar, title } = props;

  const handleCountChange = (event) => {
    setCount(parseInt(event.target.value, 10));
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const generateLoremIpsum = () => {
    let generatedText = "";

    switch (selectedOption) {
      case "paragraphs":
        generatedText = <LoremIpsum p={count} />;
        break;
      case "words":
        generatedText = <LoremIpsum w={count} />;
        break;
      case "bytes":
        generatedText = <LoremIpsum bytes={count} />;
        break;
      case "lists":
        generatedText = <LoremIpsum ul={count} />;
        break;
      default:
        break;
    }

    setLoremText(generatedText);
  };

  useEffect(() => {
    setSidebar(true);
  }, [setSidebar, true]);

  return (
    <Tool title={title}>
      <div>
        <label>
          Cantidad:
          <input type="number" value={count} onChange={handleCountChange} />
        </label>

        <div>
          <label>
            <input
              type="radio"
              value="paragraphs"
              checked={selectedOption === "paragraphs"}
              onChange={handleOptionChange}
            />
            Paragraphs
          </label>
          <label>
            <input
              type="radio"
              value="words"
              checked={selectedOption === "words"}
              onChange={handleOptionChange}
            />
            Words
          </label>
          <label>
            <input
              type="radio"
              value="bytes"
              checked={selectedOption === "bytes"}
              onChange={handleOptionChange}
            />
            Bytes
          </label>
          <label>
            <input
              type="radio"
              value="lists"
              checked={selectedOption === "lists"}
              onChange={handleOptionChange}
            />
            Lists
          </label>
        </div>

        <button onClick={generateLoremIpsum}>Generar</button>
      </div>
      <hr />
      <pre>
        <div className="codeContainer">
          <div className="codeDiv">
            <span>jsx</span>
            <span className="" data-state="closed">
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  border: "none",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ strokeWidth: "2", height: "1rem", width: "1rem" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Copy code
              </button>
            </span>
          </div>
          <div
            style={{
              color: "#FFF",
              fontSize: "14px",
              padding: "1rem",
              overflowY: "auto",
            }}
          >
            <code className="!whitespace-pre hljs language-jsx">
              {loremText}
            </code>
          </div>
        </div>
      </pre>
    </Tool>
  );
};

export default LoremIpsumGenerator;
