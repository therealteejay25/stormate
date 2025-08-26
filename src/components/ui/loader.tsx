import React from "react";
import '@/styles/loader.css'

const Loader = ({height}:{height: number}) => {
  return (
    <svg className={`loader h-10`} viewBox="6 6 12 12">
      <circle r="20" cy="50" cx="50"></circle>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa itaque fugit doloremque temporibus exercitationem amet accusamus reiciendis, maiores dolore adipisci consectetur delectus, officia dolorum, repellendus recusandae. Nisi rerum sequi temporibus!
    </svg>
  );
};

export default Loader;
