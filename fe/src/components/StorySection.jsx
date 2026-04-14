import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, HeartHandshake } from 'lucide-react';

const StorySection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-24 bg-brand-50 overflow-hidden relative">
      {/* Background Decorative element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Nửa Trái: Hình ảnh minh họa */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <img
                src="https://danviet.ex-cdn.com/files/f1/upload/3-2015/images/2015-09-11/1441924958-rau.jpg"
                alt="Nông dân thu hoạch rau củ Đà Lạt"
                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block border border-slate-100">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800">100% Organic</h4>
                    <p className="text-xs text-slate-500">Giữ trọn vẹn tinh túy đất trời</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nửa Phải: Nội dung câu chuyện */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 font-bold text-sm mb-6 uppercase tracking-wider">
              Câu Chuyện Của Chúng Tôi
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Hành trình chân thực <br /> <span className="text-brand-600">từ Nông trại đến Bàn ăn</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-8 leading-relaxed">
              Chúng tôi từng chứng kiến những giọt mồ hôi của người nông dân nâng niu từng mầm xanh khỏe mạnh, nhưng lại bị kẹt giữa chuỗi cung ứng phức tạp khiến rau quả mất đi sự tươi ngon. Vì vậy, chiếc cầu nối trực tiếp này ra đời.
            </motion.p>

            <div className="space-y-6">
              <motion.div variants={itemVariants} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-500 border border-brand-100">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Nguồn Gốc Minh Bạch</h4>
                  <p className="text-slate-600">Tuyệt đối không qua tay gian thương. Tất cả sản phẩm đều được thu hoạch trực tiếp tại nông trại đạt chuẩn VietGAP & GlobalGAP.</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-500 border border-brand-100">
                    <HeartHandshake size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Tôn vinh Giá Trị Yêu Thương</h4>
                  <p className="text-slate-600">Bạn đang không chỉ mua một bữa ăn an toàn cho gia đình, mà còn đang đóng góp trực tiếp và nâng cao sinh kế cho người nông dân Việt.</p>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-brand-200">
              <p className="font-medium text-slate-800 italic text-lg opacity-80">
                "Chúng tôi đi tìm sự thuần khiết nguyên bản, để ban có quyền được an tâm thưởng thức vị ngọt của sức khỏe."
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
