-- Source: https://www.percona.com/blog/store-uuid-optimized-way/
DELIMITER //
CREATE FUNCTION orderedUuid (_uuid BINARY(36)) 
RETURNS BINARY(16) DETERMINISTIC 
RETURN UNHEX(CONCAT(SUBSTR(_uuid, 15, 4),SUBSTR(_uuid, 10, 4),SUBSTR(_uuid, 1, 8),SUBSTR(_uuid, 20, 4),SUBSTR(_uuid, 25)));
//
DELIMITER ;