import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">ABOUT US</h1>
              <p>The only thing we're serious about is food.</p>
            </div>
            <p className="mid">
            At Sizzle & Spice, we offer more than just great food and a seamless reservation experience – we’re committed to making a difference. As part of our dedication to achieving the Zero Hunger Sustainable Development Goal, we’ve implemented a donation option for our guests. With every meal you enjoy, you can choose to contribute to providing nutritious meals for those in need. By dining with us, you're not only indulging in delicious dishes, but also helping to fight hunger and support local communities. Join us in creating a world where no one goes hungry.
            </p>
            <Link to={"/"}>
              Explore Menu{" "}
              <span>
                <HiOutlineArrowRight />
              </span>
            </Link>
          </div>
          <div className="banner">
            <img src="about.png" alt="about" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
