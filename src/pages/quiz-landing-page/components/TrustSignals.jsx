import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
  {
    id: 1,
    name: "Certificado MEC",
    image: "https://images.unsplash.com/photo-1576243165717-ce0a37f0ac8b",
    alt: "Certificado oficial do Ministério da Educação brasileiro com selo dourado"
  },
  {
    id: 2,
    name: "ABMES Aprovado",
    image: "https://images.unsplash.com/photo-1640950224542-0e02533ce9f7",
    alt: "Selo de aprovação da Associação Brasileira de Mantenedoras de Ensino Superior"
  },
  {
    id: 3,
    name: "ISO 9001",
    image: "https://images.unsplash.com/photo-1652180809798-a02daf2742b9",
    alt: "Certificado ISO 9001 de qualidade em gestão educacional"
  }];


  const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Aprovada - Banco do Brasil",
    avatar: "https://images.unsplash.com/photo-1654874071275-6a313b4ce20c",
    avatarAlt: "Mulher profissional sorrindo com cabelo castanho e blazer azul marinho",
    content: "O quiz me ajudou a focar nos pontos certos. Passei em 3º lugar!",
    rating: 5
  },
  {
    id: 2,
    name: "João Santos",
    role: "Aprovado - Receita Federal",
    avatar: "https://images.unsplash.com/photo-1718722183119-2ee4129f1a73",
    avatarAlt: "Homem profissional de terno cinza com sorriso confiante em escritório moderno",
    content: "Plano de estudos realista para quem trabalha. Recomendo muito!",
    rating: 5
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "Aprovada - TRT",
    avatar: "https://images.unsplash.com/photo-1639040538847-a47ef0dc004e",
    avatarAlt: "Mulher executiva com cabelo loiro e blazer branco em ambiente corporativo",
    content: "Consegui organizar meus estudos mesmo sendo mãe e trabalhando.",
    rating: 5
  }];


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) =>
    <Icon
      key={index}
      name="Star"
      size={16}
      color={index < rating ? "#eab308" : "#e2e8f0"}
      className={index < rating ? "fill-current" : ""} />

    );
  };

  return (
    <section className="bg-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certifications */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-text-primary mb-8">
            Certificações e Reconhecimentos
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {certifications?.map((cert) =>
            <div key={cert?.id} className="flex flex-col items-center space-y-2">
                <div className="w-24 h-16 bg-white rounded-lg shadow-soft overflow-hidden">
                  <Image
                  src={cert?.image}
                  alt={cert?.alt}
                  className="w-full h-full object-cover" />

                </div>
                <span className="text-sm font-medium text-text-secondary">
                  {cert?.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            O que dizem nossos aprovados
          </h3>
          <p className="text-text-secondary mb-12">
            Mais de 12 mil pessoas já descobriram seu nível de preparação
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) =>
            <div
              key={testimonial?.id}
              className="bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.avatarAlt}
                    className="w-full h-full object-cover" />

                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-text-primary">
                      {testimonial?.name}
                    </h4>
                    <p className="text-sm text-success font-medium">
                      {testimonial?.role}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  {renderStars(testimonial?.rating)}
                </div>

                <p className="text-text-secondary italic">
                  "{testimonial?.content}"
                </p>
              </div>
            )}
          </div>

          {/* Trust Badge */}
          <div className="mt-12 inline-flex items-center space-x-2 bg-success text-success-foreground px-6 py-3 rounded-full">
            <Icon name="Shield" size={20} />
            <span className="font-semibold">
              Mais de 2.300 aprovações em 2024
            </span>
          </div>
        </div>
      </div>
    </section>);

};

export default TrustSignals;