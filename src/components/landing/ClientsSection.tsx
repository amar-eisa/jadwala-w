import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import geziraLogo from "@/assets/clients/gezira-university.png";
import omdurmanLogo from "@/assets/clients/omdurman-islamic-university.png";
import nileLogo from "@/assets/clients/nile-university.png";

const clients = [
  {
    name: "جامعة الجزيرة",
    logo: geziraLogo,
  },
  {
    name: "جامعة أمدرمان الإسلامية",
    logo: omdurmanLogo,
  },
  {
    name: "جامعة النيل",
    logo: nileLogo,
  },
];

const ClientsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="clients" className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10" dir="rtl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">شركاء النجاح</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-primary-text">يثقون بنا</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            جامعات رائدة تعتمد على نظام جدولة في إدارة جداولها الأكاديمية
          </p>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-5 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="h-32 w-full flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-32 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-center group-hover:text-primary transition-colors">
                {client.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;
