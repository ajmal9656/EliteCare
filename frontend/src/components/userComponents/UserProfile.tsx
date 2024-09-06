function UserProfile() {
    return (
      <section className="w-full overflow-hidden dark:bg-white">
        <div className="flex flex-col">
          {/* Background Image with Reduced Height */}
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="User Cover"
            className="w-full xl:h-[10rem] lg:h-[9rem] md:h-[8rem] sm:h-[7rem] xs:h-[5rem]"
          />
  
          <div className="flex flex-col items-center relative -top-[5rem] md:-top-[4rem] sm:-top-[3rem] xs:-top-[2rem]">
            <img
              src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="User Profile"
              className="rounded-full lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500"
            />
            <h1 className="mt-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif text-center">
              Samuel Abera
            </h1>
          </div>
  
          <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
            <div className="w-full my-auto py-6 flex flex-col gap-4">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-gray-900 dark:divide-gray-700">
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Name
                      </dt>
                      <dd className="text-lg font-semibold">Samuel</dd>
                    </div>
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Age
                      </dt>
                      <dd className="text-lg font-semibold">25</dd>
                    </div>
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Date Of Birth
                      </dt>
                      <dd className="text-lg font-semibold">21/02/1997</dd>
                    </div>
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Gender
                      </dt>
                      <dd className="text-lg font-semibold">Male</dd>
                    </div>
                  </dl>
                </div>
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-gray-900 dark:divide-gray-700">
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Location
                      </dt>
                      <dd className="text-lg font-semibold">
                        Ethiopia, Addis Ababa
                      </dd>
                    </div>
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Phone Number
                      </dt>
                      <dd className="text-lg font-semibold">+251913****30</dd>
                    </div>
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Email
                      </dt>
                      <dd className="text-lg font-semibold">
                        samuelabera87@gmail.com
                      </dd>
                    </div>
                    <div className="flex flex-col py-3 last:border-b last:border-gray-300 last:dark:border-gray-600">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Website
                      </dt>
                      <dd className="text-lg font-semibold">
                        https://www.teclick.com
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default UserProfile;
  