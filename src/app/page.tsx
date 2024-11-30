import styles from "./page.module.css";
import ChatWindow from "@/components/molecules/ChatWindow/ChatWindow";

export default function Home() {
  return (
    <div className={styles.page}>
      <ChatWindow />
    </div>
  );
}
