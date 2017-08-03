package club.itbus.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Desc:
 * Mail: hehaiyang@terminus.io
 * Date: 2017/7/30
 */
public class JwtUtil {

    //Sample method to construct a JwtUtil
    public static String createJWT(String id, String subject, long ttlMillis) {

        //The JwtUtil signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        //We will sign our JwtUtil with our ApiKey secret
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(Constant.JWT_SECRET);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        //Let's set the JwtUtil Claims
        JwtBuilder builder = Jwts.builder().setId(id)
                .setIssuedAt(now)
                .setSubject(subject)
                .signWith(signatureAlgorithm, signingKey);

        //if it has been specified, let's add the expiration
        if (ttlMillis >= 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }

        //Builds the JwtUtil and serializes it to a compact, URL-safe string
        return builder.compact();
    }

    //Sample method to validate and read the JwtUtil
    public static Map<String, Object> parseJWT(String jwt) {
        //This line will throw an exception if it is not a signed JWS (as expected)
        Claims claims = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(Constant.JWT_SECRET))
                .parseClaimsJws(jwt).getBody();
        Map<String, Object> result = new HashMap<>();
        result.put("id", claims.getId());
        result.put("subject", claims.getSubject());
        result.put("expiration", claims.getExpiration());
        return result;
    }

}
