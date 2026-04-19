import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, HeartHandshake, Sprout, HeartPulse, Recycle } from 'lucide-react';

const STORIES = [
  {
    id: 1,
    badgeTitle: '100% Organic',
    badgeSub: 'Giữ trọn vẹn tinh túy đất trời',
    badgeIcon: Leaf,
    title1: 'Hành trình chân thực',
    title2: 'từ Nông trại đến Bàn ăn',
    description: 'Chúng tôi từng chứng kiến những giọt mồ hôi của người nông dân nâng niu từng mầm xanh khỏe mạnh, nhưng lại bị kẹt giữa chuỗi cung ứng phức tạp khiến rau quả mất đi sự tươi ngon. Vì vậy, chiếc cầu nối trực tiếp này ra đời.',
    img: 'https://danviet.ex-cdn.com/files/f1/upload/3-2015/images/2015-09-11/1441924958-rau.jpg',
    features: [
      {
        icon: ShieldCheck,
        title: 'Nguồn Gốc Minh Bạch',
        desc: 'Tuyệt đối không qua tay gian thương. Tất cả sản phẩm đều được thu hoạch trực tiếp tại nông trại đạt chuẩn VietGAP & GlobalGAP.'
      },
      {
        icon: HeartHandshake,
        title: 'Tôn vinh Giá Trị Yêu Thương',
        desc: 'Bạn đang không chỉ mua một bữa ăn an toàn cho gia đình, mà còn đang đóng góp trực tiếp nâng cao sinh kế cho nhà nông Việt.'
      }
    ],
    quote: '"Chúng tôi đi tìm sự thuần khiết nguyên bản, để bạn có quyền được an tâm thưởng thức vị ngọt của sức khỏe."'
  },
  {
    id: 2,
    badgeTitle: 'Healthy Choice',
    badgeSub: 'Tái tạo năng lượng sống',
    badgeIcon: HeartPulse,
    title1: 'Sức khoẻ nguyên sơ',
    title2: 'bắt đầu từ Mâm cơm',
    description: 'Giữa thực trạng thực phẩm bẩn tràn lan, chúng tôi thấu hiểu nỗi hoang mang của bạn. Rời xa sự hối hả, chúng tôi đi tìm những vùng đất tinh khiết nhất để mang về hương vị thanh thuần giúp chữa lành cơ thể bạn.',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
    features: [
      {
        icon: Sprout,
        title: 'Dưỡng Chất Thuần Khiết',
        desc: 'Canh tác không hóa chất giúp bảo toàn tối đa lượng vitamin và enzim thiết yếu, hồi phục sức đề kháng tự nhiên cho cơ thể.'
      },
      {
        icon: ShieldCheck,
        title: 'Bảo Vệ Cả Gia Đình',
        desc: 'Quy trình xét nghiệm tồn dư sinh học gắt gao nhất, giúp bạn yên tâm rửa rau nhặt lá mà không hề lo âu.'
      }
    ],
    quote: '"Đừng để thức ăn trơ trọi thành thuốc chữa bệnh, hãy để tự nhiên nuôi dưỡng cơ thể bạn từ những nụ mầm nhỏ nhất."'
  },
  {
    id: 3,
    badgeTitle: 'Eco Friendly',
    badgeSub: 'Bảo vệ hệ sinh thái',
    badgeIcon: Recycle,
    title1: 'Mua sắm thông minh',
    title2: 'Bảo vệ Trái Đất xanh',
    description: 'Mỗi trái cà chua, mớ hành bạn chọn hôm nay là một cái ôm dành cho hành tinh. Canh tác thuận tự nhiên và vật liệu xanh là cách chúng tôi tạo ra vòng tuần hoàn bất tận cho hệ sinh thái tương lai.',
    img: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=1200&auto=format&fit=crop',
    features: [
      {
        icon: Leaf,
        title: 'Thuận Tự Nhiên',
        desc: 'Không sử dụng thuốc diệt cỏ. Chúng tôi duy trì đa dạng sinh thái, để thiên địch tự diệt sâu bọ và làm giàu thêm cho cấu trúc đất.'
      },
      {
        icon: HeartHandshake,
        title: 'Gìn Giữ Môi Trường',
        desc: 'Nỗ lực không ngừng nghỉ trong việc đóng gói với túi giấy tự phân hủy, giảm tối đa rác thải nhựa trong từng khâu vận chuyển.'
      }
    ],
    quote: '"Một bữa cơm ngon nhất không chỉ khỏe cho cơ thể, mà còn không để lại tì vết nào lên sự trong lành của tự nhiên."'
  }
];

const StorySection = () => {
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    // Select randomly on load
    const randomIndex = Math.floor(Math.random() * STORIES.length);
    setCurrentStory(STORIES[randomIndex]);
  }, []);

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

  // Prevent render before client-side hydration picks the random story
  if (!currentStory) return null;

  const BadgeIcon = currentStory.badgeIcon;

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-brand-50 overflow-hidden relative">
      {/* Background Decorative element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-brand-200 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">

          {/* Left: Image */}
          <motion.div
            key={`img-${currentStory.id}`}
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <img
                src={currentStory.img}
                alt="Nguồn sống tự nhiên"
                className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl object-cover h-[280px] sm:h-[360px] md:h-[420px] lg:h-[500px] w-full"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl max-w-[200px] sm:max-w-xs hidden sm:block border border-slate-100">
                <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    <BadgeIcon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">{currentStory.badgeTitle}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500">{currentStory.badgeSub}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            key={`content-${currentStory.id}`}
            className="w-full lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-100 text-brand-700 font-bold text-xs sm:text-sm mb-4 sm:mb-6 uppercase tracking-wider">
              Câu Chuyện Của Chúng Tôi
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-tight">
              {currentStory.title1} <br className="hidden sm:block" /> <span className="text-brand-600">{currentStory.title2}</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              {currentStory.description}
            </motion.p>

            <div className="space-y-4 sm:space-y-6">
              {currentStory.features.map((feature, idx) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div key={idx} variants={itemVariants} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-500 border border-brand-100">
                        <FeatureIcon size={16} className="sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2">{feature.title}</h4>
                      <p className="text-sm sm:text-base text-slate-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={itemVariants} className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-brand-200">
              <p className="font-medium text-slate-800 italic text-base sm:text-lg opacity-80">
                {currentStory.quote}
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
