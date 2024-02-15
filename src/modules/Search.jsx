import { useEffect, useState } from "react";
import { searchCoin } from "../services/cryptoApi";
import { RotatingLines } from "react-loader-spinner";
import styles from "./Search.module.css";

function Search({ currency, setCurrency }) {
  const [text, setText] = useState("");
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currencyHandler = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {
    const controller = new AbortController();
    setCoins([]);
    if (!text) {
      setIsLoading(false);
    }

    const search = async () => {
      try {
        const res = await fetch(searchCoin(text), {
          signal: controller.signal,
        });
        const json = await res.json();
        console.log(json);
        if (json.coins) {
          setIsLoading(false);
          setCoins(json.coins);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          alert(error.messae);
        }
      }
    };
    setIsLoading(true);
    search();
    return () => controller.abort();
  }, [text]);

  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        placeholder="Search ..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select onChange={currencyHandler} value={currency}>
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
        <option value="jpy">JPY</option>
      </select>
      {(!!coins.length || isLoading) && (
        <div className={styles.searchResult}>
          {isLoading && (
            <RotatingLines width="50px" height="50px" strokeWidth="2" />
          )}
          {coins.map((coin) => (
            <li key={coin.id}>
              <img src={coin.thumb} alt={coin.name} />
              <p>{coin.name}</p>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
