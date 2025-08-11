import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
  PlusIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ReceiptRefundIcon,
  ComputerDesktopIcon,
  InformationCircleIcon,
  FunnelIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  InboxIcon,
  EnvelopeOpenIcon,
  PencilSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Geist } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const font = Geist({
  subsets: ["latin"],
});

const Sidebar = () => {
  const [ecommerceOpen, setEcommerceOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [customerOpen, setCustomerOpen] = useState(true);
  const [emailOpen, setEmailOpen] = useState(true);
  const [pageOpen, setPageOpen] = useState(true);
  const [userRole, setUserRole] = useState("");
  const pathname = usePathname();

  // Get user role from localStorage
  useEffect(() => {
    const cmsUser = localStorage.getItem("cmsUser");
    if (cmsUser) {
      const userData = JSON.parse(cmsUser);
      setUserRole(userData.role || "marketer"); // Default to marketer if no role specified
    }
  }, []);

  return (
    <div
      className={`${font.className} w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col`}
    >
      {/* Logo Section
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/certifurb.png" 
            alt="Certifurb Logo" 
            className="h-8 w-auto"
          />
          <span className="text-xl font-semibold text-gray-800">certifurb</span>
        </div>
      </div> */}

      {/* Navigation Menu */}
      <nav className="p-4">
        {/* Home */}
        <div className="mb-6">
          <Link href={"/cms/dashboard"}>
            <button
              className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                pathname === "/cms/dashboard"
                  ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </button>
          </Link>
        </div>

        {/* APPS Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            APPS
          </h3>

          {/* E-commerce - Collapsible (Admin and Sales Only) */}
          {(userRole === "admin" || userRole === "sales") && (
            <div className="mb-2">
              <button
                onClick={() => setEcommerceOpen(!ecommerceOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-left  text-gray-600 rounded-lg transition-colors hover:bg-green-200"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">E-commerce</span>
                </div>
                {ecommerceOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>

              {/* E-commerce Dropdown */}
              {ecommerceOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {/* Admin Section */}
                  <div>
                    <button
                      onClick={() => setAdminOpen(!adminOpen)}
                      className="w-full flex items-center justify-between px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <span className="text-sm">Admin</span>
                      </div>
                      {adminOpen ? (
                        <ChevronDownIcon className="h-3 w-3" />
                      ) : (
                        <ChevronRightIcon className="h-3 w-3" />
                      )}
                    </button>

                    {/* Admin Dropdown Items */}
                    {adminOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {/* Add Product - Admin Only */}
                        {userRole === "admin" && (
                          <Link href="/cms/Admin/add-product">
                            <button
                              className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                                pathname === "/cms/Admin/add-product"
                                  ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <PlusIcon className="h-3 w-3" />
                              <span className="text-xs">Add Product</span>
                            </button>
                          </Link>
                        )}
                        {/* Bulk Upload CSV - Admin Only */}
                        {userRole === "admin" && (
                          <Link href="/cms/Admin/bulk-upload">
                            <button
                              className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                                pathname === "/cms/Admin/bulk-upload"
                                  ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <DocumentTextIcon className="h-3 w-3" />
                              <span className="text-xs">Bulk Upload CSV</span>
                            </button>
                          </Link>
                        )}
                        <Link href="/cms/Admin/products">
                          <button
                            className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                              pathname === "/cms/Admin/products"
                                ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <ArchiveBoxIcon className="h-3 w-3" />
                            <span className="text-xs">Products</span>
                          </button>
                        </Link>
                        <Link href="/cms/Admin/customers">
                          <button
                            className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                              pathname === "/cms/Admin/customers"
                                ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <UsersIcon className="h-3 w-3" />
                            <span className="text-xs">Customers</span>
                          </button>
                        </Link>

                        <Link href="/cms/Admin/orders">
                          <button
                            className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                              pathname === "/cms/Admin/orders"
                                ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <ClipboardDocumentListIcon className="h-3 w-3" />
                            <span className="text-xs">Orders</span>
                          </button>
                        </Link>
                        <Link href="/cms/Admin/shipments">
                          <button
                            className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                              pathname === "/cms/Admin/shipments"
                                ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <TruckIcon className="h-3 w-3" />
                            <span className="text-xs">Shipments</span>
                          </button>
                        </Link>
                        <Link href="/cms/Admin/refund">
                          <button
                            className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                              pathname === "/cms/Admin/refund"
                                ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <ReceiptRefundIcon className="h-3 w-3" />
                            <span className="text-xs">Refund</span>
                          </button>
                        </Link>
                        {/* Auction Requests - Admin Only */}
                        {userRole === "admin" && (
                          <Link href="/cms/Admin/auction-requests">
                            <button
                              className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                                pathname === "/cms/Admin/auction-requests"
                                  ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <ClipboardDocumentListIcon className="h-3 w-3" />
                              <span className="text-xs">Auction Requests</span>
                            </button>
                          </Link>
                        )}
                        {userRole === "admin" && (
                          <Link href="/cms/Admin/add-auction-product">
                            <button
                              className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                                pathname === "/cms/Admin/add-auction-product"
                                  ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <PlusIcon className="h-3 w-3" />
                              <span className="text-xs">
                                Add Auction Product
                              </span>
                            </button>
                          </Link>
                        )}
                        <Link href="/cms/Admin/auction-products">
                          <button
                            className={`w-full flex items-center space-x-2 px-3 py-1 text-left rounded transition-colors ${
                              pathname === "/cms/Admin/auction-products"
                                ? "bg-green-50 text-green-700 border-l-2 border-green-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <ClipboardDocumentListIcon className="h-3 w-3" />
                            <span className="text-xs">Auction Products</span>
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Customer Section */}
                  <div>
                    <button
                      onClick={() => setCustomerOpen(!customerOpen)}
                      className="w-full flex items-center justify-between px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <span className="text-sm">Customer</span>
                      </div>
                      {customerOpen ? (
                        <ChevronDownIcon className="h-3 w-3" />
                      ) : (
                        <ChevronRightIcon className="h-3 w-3" />
                      )}
                    </button>

                    {/* Customer Dropdown Items */}
                    {customerOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <ComputerDesktopIcon className="h-3 w-3" />
                          <span className="text-xs">
                            <Link href={"/"}>Homepage</Link>
                          </span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <InformationCircleIcon className="h-3 w-3" />
                          <span className="text-xs">
                            <Link href={"/product"}>Product details</Link>
                          </span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <FunnelIcon className="h-3 w-3" />
                          <span className="text-xs">
                            <Link href={"/category"}>Products filter</Link>
                          </span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <ShoppingBagIcon className="h-3 w-3" />
                          <span className="text-xs">
                            <Link href={"/view-cart"}>Cart</Link>
                          </span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <CreditCardIcon className="h-3 w-3" />
                          <span className="text-xs">
                            <Link href={"/checkout"}>Checkout</Link>
                          </span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <TruckIcon className="h-3 w-3" />
                          <span className="text-xs">Shipping info</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                          <UserCircleIcon className="h-3 w-3" />
                          <span className="text-xs">
                            <Link href={"/user-profile"}>Profile</Link>
                          </span>
                        </button>
                        {/* <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                        <BuildingStorefrontIcon className="h-3 w-3" />
                        <span className="text-xs">Favorite stores</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                        <HeartIcon className="h-3 w-3" />
                        <span className="text-xs">Wishlist</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                        <MagnifyingGlassIcon className="h-3 w-3" />
                        <span className="text-xs">Order tracking</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                        <DocumentTextIcon className="h-3 w-3" />
                        <span className="text-xs">Invoice</span>
                      </button> */}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email - Collapsible */}
          <div className="mb-2">
            <button
              onClick={() => setEmailOpen(!emailOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-600 hover:bg-green-200 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Email</span>
              </div>
              {emailOpen ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>

            {/* Email Dropdown */}
            {emailOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <Link href="/cms/Email/Inbox">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <InboxIcon className="h-4 w-4" />
                    <span className="text-sm">Inbox</span>
                  </button>
                </Link>
                <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                  <EnvelopeOpenIcon className="h-4 w-4" />
                  <span className="text-sm">
                    <Link href="/cms/Email/EmailDetail">Email detail</Link>
                  </span>
                </button>
                <Link href="/cms/Email/Compose">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <PencilSquareIcon className="h-4 w-4" />
                    <span className="text-sm">Compose</span>
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Pages - Collapsible */}
          <div className="mb-2">
            <button
              onClick={() => setPageOpen(!pageOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-left  text-gray-600 rounded-lg transition-colors hover:bg-green-200"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Pages</span>
              </div>
              {pageOpen ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>

            {/* Pages Dropdown */}
            {pageOpen && (
              <div className="ml-4 mt-2 space-y-1">
                {/* Pages Section */}
                <Link href="/category">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <TagIcon className="h-4 w-4" />
                    <span className="text-sm">Categories</span>
                  </button>
                </Link>
                <Link href="/product">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <InformationCircleIcon className="h-4 w-4" />
                    <span className="text-sm">Products</span>
                  </button>
                </Link>
                <Link href="/view-cart">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <ShoppingBagIcon className="h-4 w-4" />
                    <span className="text-sm">Cart</span>
                  </button>
                </Link>
                <Link href="/checkout">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <CreditCardIcon className="h-4 w-4" />
                    <span className="text-sm">Checkout</span>
                  </button>
                </Link>
                <Link href="/user-profile">
                  <button className="w-full flex items-center space-x-2 px-3 py-1 text-left text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <UserCircleIcon className="h-4 w-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
