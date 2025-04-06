import { LoaderCircle } from "lucide-react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <LoaderCircle className={styles.loader} />
  );
};

export default Loading;