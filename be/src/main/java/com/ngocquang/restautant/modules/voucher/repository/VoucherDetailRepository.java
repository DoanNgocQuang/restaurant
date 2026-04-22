package com.ngocquang.restautant.modules.voucher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.voucher.entity.VoucherDetail;

@Repository
public interface VoucherDetailRepository extends JpaRepository<VoucherDetail, Integer> {

    @Query("""
            select count(distinct vd.user.id)
            from VoucherDetail vd
            where vd.voucher.id = :voucherId
              and vd.used = true
              and vd.user is not null
            """)
    long countDistinctUsedUsersByVoucherId(@Param("voucherId") Integer voucherId);

    @Query("SELECT COUNT(vd) > 0 FROM VoucherDetail vd WHERE vd.voucher.id = :voucherId AND vd.user.id = :userId")
    boolean existsByVoucherIdAndUserId(@Param("voucherId") Integer voucherId, @Param("userId") Integer userId);
}