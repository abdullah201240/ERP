import Design from '@/components/table/DesignDevelopmentTable'
export default function Home() {
  return (
    <div>

      <div className="bg-[#F1F2F3]  pl-0 mt-2  ">
        <h1 className="text-2xl  text-black">All Projects</h1>

        <div className="bg-white mt-8 p-4 rounded-xl">
          <h1 className="text-center text-xl mb-4 ">Design & Development</h1>

          <div className="w-[98vw] md:w-full">
            <Design />
          </div>






        </div>
        <div>

        </div>



      </div>
    </div>
  );
}
