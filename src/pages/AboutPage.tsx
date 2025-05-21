
import React from 'react';
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-posterzone-charcoal mb-2">About PosterZone</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Transforming spaces with unique and stunning poster art since 2015</p>
        </motion.div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              PosterZone began with a simple vision: to transform blank walls into captivating showcases of art that reflect 
              individual personalities and styles. Founded in 2015 by a group of art enthusiasts and interior designers, 
              we set out to create a collection of high-quality posters that could breathe life into any space.
            </p>
            <p className="text-gray-700">
              What started as a small studio in a garage has now grown into a thriving community of artists, designers, 
              and art lovers from around the world. Today, we offer thousands of designs across various categories, 
              from classic movie posters to modern abstract art, all printed on premium materials with eco-friendly inks.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img 
              src="https://images.unsplash.com/photo-1512025316832-8658f04f8a83?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80" 
              alt="Our Workshop" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-50 p-8 rounded-lg mb-16"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Our Mission</h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto">
            We believe that art should be accessible to everyone. Our mission is to democratize wall art by offering 
            beautiful, affordable posters that inspire and elevate everyday spaces. We're committed to supporting 
            independent artists, practicing sustainable production methods, and fostering a creative community that 
            celebrates diversity in artistic expression.
          </p>
        </motion.div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Sarah Johnson",
                position: "Founder & Creative Director",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Michael Chen",
                position: "Head of Design",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Olivia Rodriguez",
                position: "Marketing Manager",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "James Wilson",
                position: "Operations Manager",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md text-center"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality",
                description: "We never compromise on the quality of our products. From selecting premium papers to using archival inks, we ensure that every poster exceeds expectations."
              },
              {
                title: "Sustainability",
                description: "We're committed to reducing our environmental footprint by using eco-friendly materials, minimizing waste, and implementing sustainable practices throughout our operations."
              },
              {
                title: "Community",
                description: "We actively support independent artists and designers by featuring their work and providing fair compensation. Your purchase directly supports creative individuals."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
