
import img from '../../assets/about (1).jpg'

const About = () => {
  return (
    <div className=" min-h-screen flex flex-col lg:flex-row justify-between items-center lg:px-28 px-5 pt-24 lg:pt-16 gap-5">
      <div className=" w-full lg:w-3/4 space-y-4">
        <h1 className=" text-4xl font-semibold text-center lg:text-start">About Us</h1>
        <p className="text-justify lg:text-start">
  At EliteCare, we are dedicated to providing high-quality healthcare services that prioritize your well-being. Our platform makes it easy to access reliable health information, book doctor’s appointments, and manage your medical records, all in one place. We strive to make your healthcare experience seamless and convenient.
</p>
<p className="text-justify lg:text-start">
  Whether you're looking for advice, treatment options, or simply managing your health journey, EliteCare is here for you. We aim to ensure that you have the support you need, whenever you need it, with personalized care tailored to your specific needs.
</p>
<p className="text-justify lg:text-start">
  Our goal at EliteCare is to make healthcare easier and more accessible for everyone. With a team of professionals ready to assist, we are committed to delivering care with empathy, expertise, and a focus on your health and comfort.
</p>

      </div>
      <div className=" w-full lg:w-3/4">
        <img className=" rounded-lg" src={img} alt="img" />
      </div>
    </div>
  );
};

export default About;