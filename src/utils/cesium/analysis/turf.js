var earthRadius = 6371008.8;
var factors = {
  meters: earthRadius,
  metres: earthRadius,
  millimeters: earthRadius * 1000,
  millimetres: earthRadius * 1000,
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  kilometers: earthRadius / 1000,
  kilometres: earthRadius / 1000,
  miles: earthRadius / 1609.344,
  nauticalmiles: earthRadius / 1852,
  inches: earthRadius * 39.37,
  yards: earthRadius / 1.0936,
  feet: earthRadius * 3.28084,
  radians: 1,
  degrees: earthRadius / 111325,
};
const truf = {
  lineString: function (coordinates, properties, options) {
    if (!coordinates) throw new Error("coordinates is required");
    if (coordinates.length < 2)
      throw new Error("coordinates must be an array of two or more positions");
    // Check if first point of LineString contains two numbers
    if (!this.isNumber(coordinates[0][1]) || !this.isNumber(coordinates[0][1]))
      throw new Error("coordinates must contain numbers");

    return this.feature(
      {
        type: "LineString",
        coordinates: coordinates,
      },
      properties,
      options
    );
  },
  isObject: function (input) {
    return !!input && input.constructor === Object;
  },
  isNumber: function (num) {
    return !this.isNaN(num) && num !== null && !Array.isArray(num);
  },
  isNaN: function (n) {
    return Number.isNaN(n);
  },
  validateBBox: function (bbox) {
    if (!bbox) throw new Error("bbox is required");
    if (!Array.isArray(bbox)) throw new Error("bbox must be an Array");
    if (bbox.length !== 4 && bbox.length !== 6)
      throw new Error("bbox must be an Array of 4 or 6 numbers");
    bbox.forEach(function (num) {
      if (!this.isNumber(num))
        throw new Error("bbox must only contain numbers");
    });
  },
  validateId: function (id) {
    if (!id) throw new Error("id is required");
    if (["string", "number"].indexOf(typeof id) === -1)
      throw new Error("id must be a number or a string");
  },
  feature: function (geometry, properties, options) {
    // Optional Parameters
    options = options || {};
    if (!this.isObject(options)) throw new Error("options is invalid");
    var bbox = options.bbox;
    var id = options.id;

    // Validation
    if (geometry === undefined) throw new Error("geometry is required");
    if (properties && properties.constructor !== Object)
      throw new Error("properties must be an Object");
    if (bbox) this.validateBBox(bbox);
    if (id) this.validateId(id);

    // Main
    var feat = { type: "Feature" };
    if (id) feat.id = id;
    if (bbox) feat.bbox = bbox;
    feat.properties = properties || {};
    feat.geometry = geometry;
    return feat;
  },
  point: function (coordinates, properties, options) {
    if (!coordinates) throw new Error("coordinates is required");
    if (!Array.isArray(coordinates))
      throw new Error("coordinates must be an Array");
    if (coordinates.length < 2)
      throw new Error("coordinates must be at least 2 numbers long");
    if (!this.isNumber(coordinates[0]) || !this.isNumber(coordinates[1]))
      throw new Error("coordinates must contain numbers");

    return this.feature(
      {
        type: "Point",
        coordinates: coordinates,
      },
      properties,
      options
    );
  },
  bearing: function (start, end, options) {
    // Optional parameters
    options = options || {};
    if (!this.isObject(options)) throw new Error("options is invalid");
    var final = options.final;

    // Reverse calculation
    if (final === true) return this.calculateFinalBearing(start, end);

    var coordinates1 = this.getCoord(start);
    var coordinates2 = this.getCoord(end);

    var lon1 = this.degreesToRadians(coordinates1[0]);
    var lon2 = this.degreesToRadians(coordinates2[0]);
    var lat1 = this.degreesToRadians(coordinates1[1]);
    var lat2 = this.degreesToRadians(coordinates2[1]);
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    return this.radiansToDegrees(Math.atan2(a, b));
  },
  radiansToDegrees: function (radians) {
    if (radians === null || radians === undefined)
      throw new Error("radians is required");

    var degrees = radians % (2 * Math.PI);
    return (degrees * 180) / Math.PI;
  },
  calculateFinalBearing: function (start, end) {
    // Swap start & end
    var bear = this.bearing(end, start);
    bear = (bear + 180) % 360;
    return bear;
  },
  degreesToRadians: function (degrees) {
    if (degrees === null || degrees === undefined)
      throw new Error("degrees is required");

    var radians = degrees % 360;
    return (radians * Math.PI) / 180;
  },
  getCoord: function (obj) {
    if (!obj) throw new Error("obj is required");

    var coordinates = this.getCoords(obj);

    // getCoord() must contain at least two numbers (Point)
    if (
      coordinates.length > 1 &&
      this.isNumber(coordinates[0]) &&
      this.isNumber(coordinates[1])
    ) {
      return coordinates;
    } else {
      throw new Error("Coordinate is not a valid Point");
    }
  },
  getCoords: function (obj) {
    if (!obj) throw new Error("obj is required");
    var coordinates;

    // Array of numbers
    if (obj.length) {
      coordinates = obj;

      // Geometry Object
    } else if (obj.coordinates) {
      coordinates = obj.coordinates;

      // Feature
    } else if (obj.geometry && obj.geometry.coordinates) {
      coordinates = obj.geometry.coordinates;
    }
    // Checks if coordinates contains a number
    if (coordinates) {
      this.containsNumber(coordinates);
      return coordinates;
    }
    throw new Error("No valid coordinates");
  },
  containsNumber: function (coordinates) {
    if (
      coordinates.length > 1 &&
      this.isNumber(coordinates[0]) &&
      this.isNumber(coordinates[1])
    ) {
      return true;
    }

    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
      return this.containsNumber(coordinates[0]);
    }
    throw new Error("coordinates must only contain numbers");
  },
  lengthToRadians: function (distance, units) {
    if (distance === undefined || distance === null)
      throw new Error("distance is required");

    if (units && typeof units !== "string")
      throw new Error("units must be a string");
    var factor = factors[units || "kilometers"];
    if (!factor) throw new Error(units + " units is invalid");
    return distance / factor;
  },
  destination: function (origin, distance, bearing, options) {
    // Optional parameters
    options = options || {};
    if (!this.isObject(options)) throw new Error("options is invalid");
    var units = options.units;
    var properties = options.properties;

    // Handle input
    var coordinates1 = this.getCoord(origin);
    var longitude1 = this.degreesToRadians(coordinates1[0]);
    var latitude1 = this.degreesToRadians(coordinates1[1]);
    var bearing_rad = this.degreesToRadians(bearing);
    var radians = this.lengthToRadians(distance, units);

    // Main
    var latitude2 = Math.asin(
      Math.sin(latitude1) * Math.cos(radians) +
        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad)
    );
    var longitude2 =
      longitude1 +
      Math.atan2(
        Math.sin(bearing_rad) * Math.sin(radians) * Math.cos(latitude1),
        Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2)
      );
    var lng = this.radiansToDegrees(longitude2);
    var lat = this.radiansToDegrees(latitude2);

    return this.point([lng, lat], properties);
  },
  distance: function (from, to, options) {
    // Optional parameters
    options = options || {};
    if (!this.isObject(options)) throw new Error("options is invalid");
    var units = options.units;

    var coordinates1 = this.getCoord(from);
    var coordinates2 = this.getCoord(to);
    var dLat = this.degreesToRadians(coordinates2[1] - coordinates1[1]);
    var dLon = this.degreesToRadians(coordinates2[0] - coordinates1[0]);
    var lat1 = this.degreesToRadians(coordinates1[1]);
    var lat2 = this.degreesToRadians(coordinates2[1]);

    var a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

    return this.radiansToLength(
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      units
    );
  },
  radiansToLength: function (radians, units) {
    if (radians === undefined || radians === null)
      throw new Error("radians is required");

    if (units && typeof units !== "string")
      throw new Error("units must be a string");
    var factor = factors[units || "kilometers"];
    if (!factor) throw new Error(units + " units is invalid");
    return radians * factor;
  },
  along: function (line, distance$$1, options) {
    // Optional parameters
    options = options || {};
    if (!this.isObject(options)) throw new Error("options is invalid");

    // Validation
    var coords;
    if (line.type === "Feature") coords = line.geometry.coordinates;
    else if (line.type === "LineString") coords = line.coordinates;
    else throw new Error("input must be a LineString Feature or Geometry");
    if (!this.isNumber(distance$$1))
      throw new Error("distance must be a number");

    var travelled = 0;
    for (var i = 0; i < coords.length; i++) {
      if (distance$$1 >= travelled && i === coords.length - 1) break;
      else if (travelled >= distance$$1) {
        var overshot = distance$$1 - travelled;
        if (!overshot) return this.point(coords[i]);
        else {
          var direction = this.bearing(coords[i], coords[i - 1]) - 180;
          var interpolated = this.destination(
            coords[i],
            overshot,
            direction,
            options
          );
          return interpolated;
        }
      } else {
        travelled += this.distance(coords[i], coords[i + 1], options);
      }
    }
    return this.point(coords[coords.length - 1]);
  },
  getGeom: function (geojson) {
    if (!geojson) throw new Error("geojson is required");
    if (geojson.geometry !== undefined) return geojson.geometry;
    if (geojson.coordinates || geojson.geometries) return geojson;
    throw new Error("geojson must be a valid Feature or Geometry Object");
  },
  bezierSpline: function (line, options) {
    // Optional params
    options = options || {};
    if (!this.isObject(options)) throw new Error("options is invalid");
    var resolution = options.resolution || 10000;
    var sharpness = options.sharpness || 0.85;

    // validation
    if (!line) throw new Error("line is required");
    if (!this.isNumber(resolution))
      throw new Error("resolution must be an number");
    if (!this.isNumber(sharpness))
      throw new Error("sharpness must be an number");

    var coords = [];
    var spline = new Spline({
      points: this.getGeom(line).coordinates.map(function (pt) {
        return { x: pt[0], y: pt[1] };
      }),
      duration: resolution,
      sharpness: sharpness,
    });

    for (var i = 0; i < spline.duration; i += 10) {
      var pos = spline.pos(i);
      if (Math.floor(i / 100) % 2 === 0) {
        coords.push([pos.x, pos.y]);
      }
    }

    return this.lineString(coords, line.properties);
  },
};
var Spline = function (options) {
  this.points = options.points || [];
  this.duration = options.duration || 10000;
  this.sharpness = options.sharpness || 0.85;
  this.centers = [];
  this.controls = [];
  this.stepLength = options.stepLength || 60;
  this.length = this.points.length;
  this.delay = 0;
  // this is to ensure compatibility with the 2d version
  for (var i = 0; i < this.length; i++)
    this.points[i].z = this.points[i].z || 0;
  for (var i = 0; i < this.length - 1; i++) {
    var p1 = this.points[i];
    var p2 = this.points[i + 1];
    this.centers.push({
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
      z: (p1.z + p2.z) / 2,
    });
  }
  this.controls.push([this.points[0], this.points[0]]);
  for (var i = 0; i < this.centers.length - 1; i++) {
    var p1 = this.centers[i];
    var p2 = this.centers[i + 1];
    var dx =
      this.points[i + 1].x - (this.centers[i].x + this.centers[i + 1].x) / 2;
    var dy =
      this.points[i + 1].y - (this.centers[i].y + this.centers[i + 1].y) / 2;
    var dz =
      this.points[i + 1].z - (this.centers[i].y + this.centers[i + 1].z) / 2;
    this.controls.push([
      {
        x:
          (1.0 - this.sharpness) * this.points[i + 1].x +
          this.sharpness * (this.centers[i].x + dx),
        y:
          (1.0 - this.sharpness) * this.points[i + 1].y +
          this.sharpness * (this.centers[i].y + dy),
        z:
          (1.0 - this.sharpness) * this.points[i + 1].z +
          this.sharpness * (this.centers[i].z + dz),
      },
      {
        x:
          (1.0 - this.sharpness) * this.points[i + 1].x +
          this.sharpness * (this.centers[i + 1].x + dx),
        y:
          (1.0 - this.sharpness) * this.points[i + 1].y +
          this.sharpness * (this.centers[i + 1].y + dy),
        z:
          (1.0 - this.sharpness) * this.points[i + 1].z +
          this.sharpness * (this.centers[i + 1].z + dz),
      },
    ]);
  }
  this.controls.push([
    this.points[this.length - 1],
    this.points[this.length - 1],
  ]);
  this.steps = this.cacheSteps(this.stepLength);
  return this;
};

/*
    Caches an array of equidistant (more or less) points on the curve.
  */
Spline.prototype.cacheSteps = function (mindist) {
  var steps = [];
  var laststep = this.pos(0);
  steps.push(0);
  for (var t = 0; t < this.duration; t += 10) {
    var step = this.pos(t);
    var dist = Math.sqrt(
      (step.x - laststep.x) * (step.x - laststep.x) +
        (step.y - laststep.y) * (step.y - laststep.y) +
        (step.z - laststep.z) * (step.z - laststep.z)
    );
    if (dist > mindist) {
      steps.push(t);
      laststep = step;
    }
  }
  return steps;
};

/*
    returns angle and speed in the given point in the curve
  */
Spline.prototype.vector = function (t) {
  var p1 = this.pos(t + 10);
  var p2 = this.pos(t - 10);
  return {
    angle: (180 * Math.atan2(p1.y - p2.y, p1.x - p2.x)) / 3.14,
    speed: Math.sqrt(
      (p2.x - p1.x) * (p2.x - p1.x) +
        (p2.y - p1.y) * (p2.y - p1.y) +
        (p2.z - p1.z) * (p2.z - p1.z)
    ),
  };
};

/*
    Gets the position of the point, given time.

    WARNING: The speed is not constant. The time it takes between control points is constant.

    For constant speed, use Spline.steps[i];
  */
Spline.prototype.pos = function (time) {
  function bezier(t, p1, c1, c2, p2) {
    var B = function (t) {
      var t2 = t * t,
        t3 = t2 * t;
      return [
        t3,
        3 * t2 * (1 - t),
        3 * t * (1 - t) * (1 - t),
        (1 - t) * (1 - t) * (1 - t),
      ];
    };
    var b = B(t);
    var pos = {
      x: p2.x * b[0] + c2.x * b[1] + c1.x * b[2] + p1.x * b[3],
      y: p2.y * b[0] + c2.y * b[1] + c1.y * b[2] + p1.y * b[3],
      z: p2.z * b[0] + c2.z * b[1] + c1.z * b[2] + p1.z * b[3],
    };
    return pos;
  }
  var t = time - this.delay;
  if (t < 0) t = 0;
  if (t > this.duration) t = this.duration - 1;
  //t = t-this.delay;
  var t2 = t / this.duration;
  if (t2 >= 1) return this.points[this.length - 1];

  var n = Math.floor((this.points.length - 1) * t2);
  var t1 = (this.length - 1) * t2 - n;
  return bezier(
    t1,
    this.points[n],
    this.controls[n][1],
    this.controls[n + 1][0],
    this.points[n + 1]
  );
};
export default truf;
