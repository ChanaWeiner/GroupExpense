import { parseReceiptText } from "./parseReceiptText"; // זה הקובץ עם הפונקציה

function ReceiptScanPage() {
  const [receiptText, setReceiptText] = useState("");
  const [items, setItems] = useState([]);

  const handleTextResult = (text) => {
    setReceiptText(text);
    const parsedItems = parseReceiptText(text);
    setItems(parsedItems);
  };

  return (
    <div>
      <h2>העלאת קבלה</h2>
      <ReceiptUploader onResult={handleTextResult} />

      {items.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>פריטים שזוהו:</h3>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.name} - ₪{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
