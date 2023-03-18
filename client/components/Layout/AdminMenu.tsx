import React from "react";
import Link from "next/link";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group dashboard-menu">
          <h4>Admin Panel</h4>
          <Link
            href="/dashboard/admin/category/create"
            className="list-group-item list-group-item-action"
          >
            Create Category
          </Link>
          <Link
            href="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action"
          >
            Create Product
          </Link>
          <Link
            href="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
            Products
          </Link>
          <Link
            href="/dashboard/admin/orders"
            className="list-group-item list-group-item-action"
          >
            Orders
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Users
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
