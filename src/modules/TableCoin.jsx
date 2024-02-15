import chartUp from "../../src/assests/chart-up.svg";
import chartDown from "../../src/assests/chart-down.svg";
import { RotatingLines } from "react-loader-spinner";
import styles from "./TableCoins.module.css";
import { marketChart } from "../services/cryptoApi";

function TableCoin({ coins, isLoading, setChart, currency }) {
  return (
    <div className={styles.container}>
      {isLoading ? (
        <RotatingLines />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h</th>
              <th>Total Volume</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <TableRow
                key={coin.id}
                coin={coin}
                currency={currency}
                setChart={setChart}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableCoin;

const TableRow = ({ coin, setChart, currency }) => {
  const {
    id,
    name,
    image,
    symbol,
    total_volume,
    current_price,
    price_change_percentage_24h,
  } = coin;
  const getSign = (currency) => {
    if (currency === "usd") {
      return "$";
    } else if (currency === "eur") {
      return "EUR";
    } else if (currency === "jpy") {
      return "JPY";
    }
  };
  const showHandler = async () => {
    console.log(id);
    try {
      const res = await fetch(marketChart(id));
      const json = await res.json();
      console.log(json);
      setChart({ ...json, coin });
      console.log(json);
    } catch (error) {
      setChart(null);
    }
  };

  return (
    <tr>
      <td>
        <div className={styles.symbol} onClick={showHandler}>
          <img src={image} />
          <span>{symbol.toUpperCase()}</span>
        </div>
      </td>
      <td>{name}</td>

      <td>
        {getSign(currency)}
        {current_price.toLocaleString()}
      </td>
      <td
        className={
          price_change_percentage_24h > 0 ? styles.success : styles.error
        }>
        {price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>{total_volume.toLocaleString()}</td>
      <td>{name}</td>
      <td>
        <img
          src={price_change_percentage_24h > 0 ? chartUp : chartDown}
          alt={name}
        />
      </td>
    </tr>
  );
};
