import MainWrapper from '../../../../../components/MainWrapper/MainWrapper';
interface TravellerPublicPageProps {
  params: Promise<{ travellerId: string }>;
}

export default async function TravellerPublicPage({
  params,
}: TravellerPublicPageProps) {
  const { travellerId } = await params;

  return (
    <MainWrapper>
      <div className="container">
        <h2>Мандрівник {travellerId}</h2>
      </div>
    </MainWrapper>
  );
}
