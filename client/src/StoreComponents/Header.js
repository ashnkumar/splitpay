import React from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";


function Header() {
  const basket = ['a']

  return (
    <div className="header">

      <div className="header__search">
        <input className="header__searchInput" type="search" placeholder="Search Store..."/>
        <SearchIcon className="header__searchIcon" />
      </div>

      <div className="header__nav">
          <div className="header__option">
            <span className="header__optionLineOne">
              Hello there!
            </span>
            <span className="header__optionLineTwo">
              Sign In
            </span>
          </div>
          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
          <div className="header__optionBasket">
            <ShoppingCartRoundedIcon />
            <span className="header__optionLineTwo header__basketCount">
              {basket?.length}
            </span>
          </div>
      </div>
    </div>
  );
}

export default Header;
