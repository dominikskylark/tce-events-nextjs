import useSWR from "swr";

import React from "react";
import { AppContext } from "../pages/_app";

export default function Layout({ children }) {
  const context = React.useContext(AppContext);
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    "https://eventadmin.skylark.digital/wp-json/acf/v3/options/options",
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const styled = data.acf;

  return (
    <div>
      {children}
      <style jsx global>
        {`
          body {
            font-family: Verdana;
            color: ${styled.body_text_colour.slice(1, -1)};
            font-size: ${styled.body_text_size.slice(1, -1)};
          }
          a {
            color: ${styled.link_colour.slice(1, -1)};
          }
          a:hover {
            color: ${styled.link_hover_colour.slice(1, -1)};
          }
          button {
            background-color: ${styled.primary_button_colour};
            color: ${styled.primary_button_text_colour};
          }
          .button-primary {
            background-color: ${styled.primary_button_colour};
            color: ${styled.primary_button_text_colour};
          }
          .button-primary:hover {
            background-color: ${styled.primary_button_hover_colour};
            color: ${styled.primary_button_text_hover_colour};
          }
          .button-secondary {
            background-color: ${styled.secondary_button_colour};
            color: ${styled.secondary_button_text_colour};
          }
          .button-secondary:hover {
            background-color: ${styled.secondary_button_hover_colour};
            color: ${styled.secondary_button_text_hover_colour};
          }
          button:hover {
            background-color: ${styled.primary_button_hover_colour};
            color: ${styled.primary_button_text_hover_colour};
          }
          .nav-item {
            background-color: ${styled.secondary_button_colour};
            margin: 1rem;
            cursor: pointer;
          }
          .nav-item:hover {
            background-color: ${styled.secondary_button_hover_colour};
            margin: 1rem;
          }
          .nav-pills .nav-link {
            border-radius: 0;
          }
          a.nav-link {
            background-color: ${styled.secondary_button_colour};
            color: ${styled.secondary_button_text_colour};
            border-radius: 0;
          }
          .nav-pills .nav-link.active {
            background-color: ${styled.secondary_colour};
          }
          a.nav-link:hover {
            color: ${styled.secondary_button_hover_colour};
          }
          h1,
          h2,
          h3,
          h4,
          h5 {
            font: ${styled.heading_font
              ? styled.heading_font.replace(/['"]+/g, "")
              : "Verdana"};
            color: ${styled.heading_colour};
          }
          h1 {
            font-size: ${styled.h1_size.replace(/['"]+/g, "")};
          }
          h2 {
            font-size: ${styled.h2_size.replace(/['"]+/g, "")};
          }
          h3 {
            font-size: ${data.acf.h3_size.replace(/['"]+/g, "")};
          }
          h4 {
            font-size: ${data.acf.h4_size};
          }
          h5 {
            font-size: 20px;
          }
          .card-title {
            font-size: ${data.acf.h2_size.slice(1, -1)};
          }
          .menu-item {
            background-color: black;
          }
        `}
      </style>
    </div>
  );
}
