import { useState } from "react";
import { useRouter } from "next/router";

export default function HeaderSearch() {
  const router = useRouter();
  const [queryStr, setQueryStr] = useState("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQueryStr(e.target.value);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (queryStr) {
      router.push(`/search?q=${queryStr}`);
    }
  }

  return (
    <div className="ass1-header__search">
      <form action="#" onSubmit={handleSubmit}>
        <label>
          <input
            value={queryStr}
            onChange={onChange}
            type="search"
            className="form-control"
            placeholder="Nhập từ khóa ..."
          />
          <i className="icon-Search" />
        </label>
      </form>
    </div>
  );
}
