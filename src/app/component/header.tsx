import Link from "next/link";

interface Props {
  page: string;
}

const Header = ({ page }: Props) => {
  return (
    <div className="header">
      <Link className="link" href={"/"}>
        {"< 戻る"}
      </Link>
      <h2>{page}</h2>
    </div>
  );
};

export default Header;
