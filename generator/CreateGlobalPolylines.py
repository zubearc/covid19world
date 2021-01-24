import json
import GlobalCodes
import Polylines

with open('./global/countries.geojson', 'r') as f:
    j = json.loads(f.read())

out = {}

for feature in j['features']:
    props = feature['properties']
    code = props['ISO_A3']
    coords = feature['geometry']['coordinates']

    print(props['ADMIN'], code)

    try:
        fipsc = GlobalCodes.Iso3toIso2[code]
    except Exception:
        print('Failed', code)
        continue

    epolys = []
    if feature['geometry']['type'] == 'MultiPolygon':
        for collection in coords:
            epolysc = []
            for pairs in collection:
                # print pairs
                # print encode_coords(pairs)
                epolys.append(Polylines.encode_coords(pairs))
            # epolys.append(epolysc)
    else:
        for pairs in coords:
            # print pairs
            # print encode_coords(pairs)
            epolys.append(Polylines.encode_coords(pairs))
    # print epolys

    out[fipsc] = epolys

with open('../docs/data/global/countries-polygons.json', 'w') as f:
    f.write(json.dumps(out))