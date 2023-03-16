import Link from "next/link";

export default function HeaderMenu() {
    // const [categories] = useGlobalState("categories");

    return (
        <nav>
            <ul className="ass1-header__menu">
                <li>
                    <a>Danh mục</a>
                    <div className="ass1-header__nav">
                        <div className="container">
                            <ul>
                            {/* {
                                categories.map((cate) => {
                                    return (
                                        <li key={cate.id}>
                                            <Link href="/categories/[cateId]" as={`/categories/${cate.id}`}>
                                                <a>{cate.text}</a>
                                            </Link>
                                        </li>
                                    )
                                })
                            } */}
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}