import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { getCompareFeatures } from "../../services/member/TraningPakageService.js";
export default function CompareFeatures() {
  const [tiers, setTiers] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    getCompareFeatures().then((res) => {
      const { package_types, services } = res.data;

      // Tạo danh sách tier name
      const tierNames = package_types.map((p) => p.name);
      setTiers(tierNames);

      // 2️⃣ Map service -> feature object
      const mappedFeatures = services.map((service) => {
        const feature = {
          name: service.name,
        };

        package_types.forEach((pkg) => {
          feature[pkg.name] = service.packages.includes(pkg.id);
        });

        return feature;
      });

      setFeatures(mappedFeatures);
    });
  }, []);
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-purple-800 mb-10 italic">
          Compare All Features
        </h2>

        {/* Table Container */}
        <div className="overflow-x-auto lg:overflow-x-visible rounded-2xl shadow-xl border border-purple-100">
          <table className="w-full min-w-[520px] sm:min-w-[640px] lg:min-w-0">
            {/* Header */}
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500">
                <th className="text-left py-5 px-2 sm:px-3 text-white font-bold uppercase tracking-wider text-sm">
                  Features
                </th>
                {tiers.map((tier) => (
                  <th
                    key={tier}
                    className="py-5 px-2 sm:px-3 text-white font-bold uppercase tracking-wider text-sm text-center"
                  >
                    {tier}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td className="py-3 sm:py-5 px-3 sm:px-6 text-sm sm:text-base">
                    {feature.name}
                  </td>

                  {tiers.map((tier) => (
                    <td key={tier} className="py-5 px-4 text-center">
                      {feature[tier] ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-md shadow-purple-200 transform hover:scale-110 transition-transform duration-200">
                          <Check
                            className="w-5 h-5 text-white"
                            strokeWidth={3}
                          />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-400">
                          <X className="w-4 h-4" strokeWidth={2} />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          * All packages include free Wi-Fi and towel service
        </p>
      </div>
    </section>
  );
}
